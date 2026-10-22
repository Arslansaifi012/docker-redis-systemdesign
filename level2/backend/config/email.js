

const sendemail = async () => {
    
 await new Promise((res) => {
        setTimeout(res,5000)
    });

    console.log('email send successfully');
}


export default sendemail;