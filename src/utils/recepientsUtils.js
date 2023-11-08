export const recipientsToOptions = (recipients)=>{
    console.log(recipients);
    if (!recipients){
        return [];
    }
    return recipients.map((recipients)=>{
        return ({value: `${recipients.name} - ${recipients.dep}`, label: `${recipients.name} - ${recipients.dep}` })
    })
}