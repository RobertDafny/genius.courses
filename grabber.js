materialObj = {
    title: null,
    fileSrc: null,
    init: function(elem){
        materialObj.clean();
        let titleCss = 'p.additional-materials__name';
        let fileCss = 'a.additional-materials__file-left';
        materialObj.title = elem.querySelector(titleCss).innerText;
        materialObj.fileSrc = elem.querySelector(fileCss).getAttribute('href');
    },
    clean: function(){
        materialObj.title = null;
        materialObj.fileSrc = null;
    }
}
lessonObj = {
    title: null,
    description: null,
    url: null,
    videoSrc: null,
    materials: [],
    initMaterials: function(){
        let listCss = '.lesson-materials__list li';
        $(listCss).each(function(i,e){
            materialObj.init(e);
            lessonObj.materials.push(Object.assign({}, materialObj))
        })
    },
    clean: function(){
        lessonObj.title = null;
        lessonObj.description = null;
        lessonObj.url = null;
        lessonObj.videoSrc = null;
        lessonObj.materials = [];
    },
    init: async function(){
        lessonObj.clean();
        let titleCss = '.breadcrumbs li:nth-child(3) a, div.tests-header__title';
        let videoCss = '.plyr__video-embed__container iframe, .plyr__video-wrapper  iframe';
        let descCss = 'div.education-desc, div.tests-questions__name';
        await new Promise(resolve => {
            setTimeout(async function tick(){
                if($(descCss).length){
                    if($(videoCss).length === 0){
                        await new Promise(resolve => setTimeout(resolve,1000));
                    }
                    return resolve();
                }
                await new Promise(() => setTimeout(tick,500));
            }, 500);
        });
        let video = $(videoCss);
        lessonObj.url = window.location.href;
        lessonObj.title = $(titleCss)[0].innerText;
        lessonObj.description = $(descCss)[0].innerText;
        if(video.length !== 0){
            lessonObj.videoSrc =$(videoCss)[0].getAttribute('src').replace(/\?.*/,'');
        }
        lessonObj.initMaterials();
        await courseObj.next();
    }
}
courseObj = {
    title: null,
    description: null,
    url: null,
    imgSrc: null,
    lessons: [],
    initLessons: async function(){
        let lessonListCss = 'a.courses-dashboard_lesson-wrap';
        await new Promise(resolve => {
            setTimeout(async function tick(){
                if($(lessonListCss).length > 1){
                    return resolve();
                }
                await new Promise(() => setTimeout(tick,500));
            }, 500);
        });
        let lessonList = $(lessonListCss);
        if(courseObj.lessons.length < lessonList.length){
            lessonList[courseObj.lessons.length].click();
            await lessonObj.init()
        } else {
            courseObj.getCourseNavButton().click();
            await new Promise(resolve => setTimeout(resolve,3000));
            let descCss = '.courses-item__desc';
            let imgCss = '.image-seo-wrapper img';
            let courseIndex = treeObj.courses.length;
            courseObj.description = $(descCss)[courseIndex].innerText;
            courseObj.imgSrc = $(imgCss)[courseIndex].getAttribute('src');
            await treeObj.next();
        }
    },
    init: async function(){
        return new Promise(function(resolve){
            setTimeout(function(){
                courseObj.clean();
                let courseElem = $('.breadcrumbs li:nth-child(3) a');
                courseObj.title = courseElem[0].innerText;
                courseObj.url = window.location.href;
                courseObj.initLessons();
                resolve();
            }, 3000);
        })
    },
    clean: function(){
        courseObj.title = null;
        courseObj.url = null;
        courseObj.description = null;
        courseObj.imgSrc = null;
        courseObj.lessons = [];
    },
    getCourseNavButton: function(){
        let courseCss = '.breadcrumbs li:nth-child(2) a, .test-header__close a';
        return $(courseCss)[0];
    },
    next: async function(){
        courseObj.lessons.push(Object.assign({}, lessonObj));
        let courseElem = courseObj.getCourseNavButton();
        courseElem.click();
        await courseObj.initLessons();
    }
}
treeObj = {
    courses: [],
    isInit: function(){
        return treeObj.courses.length !== 0;
    },
    initCourses: async function(){
        await new Promise(resolve => setTimeout(resolve,3000));
        let courseListCss = 'a.courses-item__img';
        let courseList = $(courseListCss);
        if(treeObj.courses.length < courseList.length){
            courseList[treeObj.courses.length].click();
            await new Promise(resolve => setTimeout(resolve,3000));
            await courseObj.init()
        } else {
            treeObj.unload();
        }
    },
    init: async function(){
        let startPage = '/uk/courses';
        if(window.location.pathname !== startPage && !treeObj.isInit()){
            window.location.href = window.location.origin + startPage;
            return Promise.reject(new Error('Goto start page'));
        }
        await treeObj.initCourses();
    },
    next: async function(){
        treeObj.courses.push(Object.assign({}, courseObj));
        await treeObj.initCourses();
    },
    run: async function(){
        try{
            await treeObj.init();
        } catch(error) {
            return Promise.reject(new Error('Помилка: treeObj.init()'));
        }
    },
    unload: function(){
        fileObj.write(treeObj.getJsonData());
    },
    getJsonData: function(){
        return JSON.stringify(treeObj);
    }
}
fileObj = {
    name: "edu.genius.space.json",
    write: function(data){
        document.write(
            '<a href="data:text/plain;charset=utf-8,'
            + encodeURIComponent(data)
            + '" download="'
            + fileObj.name
            + '">' + fileObj.name + '</a>'
        )
    }
}
pageObj = {
    coursesObj: null,
    init: ()=>{
        pageObj.coursesObj = pageObj.getCoursesJson().then(data => data);
    },
    grabberRun: async function(){
        await treeObj.run();
    },
    getCoursesJson: async function(){
        let filePath = 'https://raw.githubusercontent.com/RobertDafny/genius.courses/main/courses-2023-all.json';
        return await fetch(filePath).then(response => response.json());
    }
}
