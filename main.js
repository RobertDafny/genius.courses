// Main script
controllerObj = {
    registerGrabberJs: async function(){
        let fileUrl = 'https://raw.githubusercontent.com/RobertDafny/genius.courses/main/grabber.js';
        try{
            let script = await fetch(fileUrl).then(response => response.text());
            eval(script);
        } catch(e){
            return Promise.reject(new Error('Помилка при отриманні файлу граббера'));
        }
    }
}
controllerObj.registerGrabberJs().then(async () => {
    $(document).ready(async function(){
        await new Promise(resolve => setTimeout(resolve,2000));
        await pageObj.init().catch(console.log);


        await pageObj.grabberRun().catch(console.log);
        pageObj.registerListeners();
    });
}).catch(console.log);
