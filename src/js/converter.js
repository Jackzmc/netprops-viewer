const DATE_COMMENT_REGEX = new RegExp(/(<!--).+(\d{4}\/\d{2}\/\d{2})/)

//This converts a raw netprops.xml input to a valid JS object that can be used for display purposes.
export default function(rawXML) {
    //Get rid of the beginning part of netprops
    console.time('parse_cleanup')
    let lines = rawXML.replace(/'/g,'"').replace(/""/g, '"').split(/\r?\n/)
    let classDetails = {_meta:{}}

    
    lines.some((line, index) => {
        // Attempt to find the date from "<!-- Dump of all network properties for "GAME" as at DATE -->"
        if(!classDetails._meta.timestamp ) {
            const dateTimestampMatch = line.match(DATE_COMMENT_REGEX);
            if(dateTimestampMatch && dateTimestampMatch.length == 3) {
                classDetails._meta.timestamp = dateTimestampMatch[2]
            }
        }
        // Sometimes there is some extra prefix, slice that off
        if(/<serverd/.test(line)) {
            lines.splice(0, index)
            return true;
        }

        return false;
    })
    console.timeEnd('parse_cleanup')
    
    //Wrap XML fragments into one root
    console.time('DOMParse')
    const xml = new DOMParser().parseFromString(lines.join("\n"), "application/xml");
    if(xml.children[0].tagName === "parsererror") throw new Error(xml.children[0].textContent)
    console.timeEnd('DOMParse')

    console.time('parse')
    const root = xml.children[0];
    const isDatamaps = root.tagName === "datamaps"
    const propTagName = isDatamaps ? "datamap" : "property"

    console.debug(root.tagName, isDatamaps)

    for(let i = 0 ; i < root.children.length; i++) {
        const properties = []
        const classElement = root.children[i];
        //console.log(classElement)
        const className = classElement.attributes.name.value;

        const allElements = classElement.getElementsByTagName('*');
        for(let li = 0; li < allElements.length; li++) {
            const elem = allElements[li];
            // Check if XML element is the <datamap or <property
            if(elem.tagName === propTagName) {
                let object = {
                    name: elem.attributes.name.value.trim(),
                    parents: getParents(elem),
                    fields: {},
                    hasChildTable: false,
                    id: `${className}.${elem.attributes.name.value}#${li}`
                }
                if(isDatamaps) {
                    object.fields['type'] = "datamap"
                }

                let valid = true, fields = {};
                for(let fieldIndex = 0; fieldIndex < elem.children.length; fieldIndex++) {
                    const propertyField = elem.children[fieldIndex];
                    if(propertyField.tagName !== "sendtable") {
                        fields[propertyField.tagName] = propertyField.textContent;
                    } else{
                        object.hasChildTable = true;
                    }
                }

                // Parse each netprop for class
                for(const fieldname in fields) {
                    const text = fields[fieldname];
                    switch(fieldname) {
                        case "flags": 
                            object.fields["flags"] = text.length > 0 ? text.split('|') : []
                            break;
                        case "type":
                            if(text === "database") return valid = false;
                            if(text === "integer") {
                                let intType = "int";
                                if(fields.flags) {
                                    const flags = fields.flags.split('|')
                                    const unsignedIndex = flags.indexOf("Unsigned");
                                    if(unsignedIndex >= 0 ) {
                                        intType = "uint";
                                        flags.splice(unsignedIndex, 1);
                                        fields.flags = flags.join("|");
                                    }
                                }
                                object.fields["type"] = `${intType}${fields.bits}`
                            } else if(text === "float") {
                                if(fields.bits > 0)
                                    object.fields["type"] = `float${fields.bits}`
                                else 
                                    object.fields["type"] = "float"
                            } else {
                                object.fields["type"] = text;
                            }
                            break;
                        default:
                            object.fields[fieldname] = text;
                            break;
                        
                    }
                }
                if(valid) properties.push(object)
            } 
        }
        classDetails[className] =  properties;
    }
    console.timeEnd('parse')
    return [classDetails, isDatamaps]
}

function getParents(element, array = []) {
    //Starts out with: empty array, and bottom most element.
    //Get parent element, if it's serverclass, thats the top parent, return array.
    if(element.parentElement.tagName === "serverclass") {
        return array;
    }else{
        //Add property to array, then recursively call getParents to fetch next parent
        if(element.parentElement.tagName === "sendtable" && element.parentElement.attributes.name) {
            array.push(element.parentElement.attributes.name.value.trim())
        }
        return getParents(element.parentElement, array);
    }
}