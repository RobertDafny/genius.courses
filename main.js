// Main script
!window.jQuery
    ? alert('Помилка!\nДля правильної роботи програми необхідно в налаштуваннях плагіна увімкнути елементи:\n1. Активно\n2. JavaScript\n3. jQuery')
    : console.log(`Версія jQuery: ${jQuery.fn.jquery}`);
controllerObj = {
    registerGrabberJs: async function(){
        let fileUrl = 'https://raw.githubusercontent.com/RobertDafny/genius.courses/main/grabber.js';
        try{
            let script = await fetch(fileUrl).then(response => response.text());
            console.log(script)
            eval(script);
        } catch(e){
            return Promise.reject(new Error(`Помилка при отриманні файлу граббера\n${e.stack}`));
        }
    }
}
controllerObj.registerGrabberJs().then(async () => {
    $(document).ready(async function(){
        await new Promise(resolve => setTimeout(resolve,2000));
        // Set to true if you need to get new courses
        pageObj.isActiveGrabber = false;
        pageObj.isRefreshCourses = false;
        await pageObj.init().catch(console.log);
        await pageObj.grabberRun().catch(console.log);
        pageObj.registerListeners();
    });
}).catch(console.log);
