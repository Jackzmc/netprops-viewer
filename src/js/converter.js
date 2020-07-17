const COLORS = ['red', 'green', 'blue', 'orange', 'purple']; //eslint-disable-line

export default function(rawXML) {
    return new Promise((resolve,reject) => {
        //Get rid of the beginning part of netprops
        let lines = rawXML.split(/\r?\n/);

        lines.some((line, index) => {
            if(/<server/.test(line)) {
                lines.splice(0, index)
                return true;
            }
            return false;
        })
        //This fixes netprop error where player_array is double quoted.. why???
        lines = lines.map(line => {
            return line.replace(/"player_array"/,"player_array");
        })
        
        //Wrap XML fragments into one root
        const XMLString = `<root>${lines.join("\n")}</root>`
        const xml = new DOMParser().parseFromString(XMLString, "application/xml");
        if(xml.children[0].tagName === "parsererror") reject(new Error('XMLParseError'))

        let classDetails = {}

        const root = xml.children[0];

        for(let i = 0 ; i < root.children.length; i++) {
            const properties = [];
            const classElement = root.children[i];
            //console.log(classElement)
            const className = classElement.attributes.name.value;

            const allElements = classElement.getElementsByTagName('*');
            for(let li = 0; li < allElements.length; li++) {
                const elem = allElements[li];
                if(elem.tagName === "property") {
                    let object = {
                        property: elem.attributes.name.value,
                        parents: getParents(elem),
                        fields: {},
                        hasChildTable: false,
                        id: `${className}-${elem.attributes.name.value}${li}`
                    }
                    let valid = true, fields = {};
                    for(let fieldIndex = 0; fieldIndex < elem.children.length; fieldIndex++) {
                        const propertyField = elem.children[fieldIndex];
                        if(propertyField.tagName !== "sendtable") {
                            fields[propertyField.tagName] = propertyField.textContent;
                        }else{
                            object.hasChildTable = true;
                        }
                    }

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
                                }else if(text === "float") {
                                    if(fields.bits > 0)
                                        object.fields["type"] = `float${fields.bits}`
                                    else 
                                        object.fields["type"] = "float"
                                }else{
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
        resolve(classDetails)
    })
}

function getParents(element, array = []) {
    //Starts out with: empty array, and bottom most element.
    //Get parent element, if it's serverclass, thats the top parent, return array.
    if(element.parentElement.tagName === "serverclass") {
        return array;
    }else{
        //Add property to array, then recursively call getParents to fetch next parent
        if(element.parentElement.tagName === "sendtable" && element.parentElement.attributes.name) {
            array.push(element.parentElement.attributes.name.value)
        }
        return getParents(element.parentElement, array);
    }
}