const burgerIconSelector = '.burger-menu',
    contentSelector = '.content-wrap',
    overlaySelector = '.content-overlay',
    underlaySelector = '.underlay',
    smallMenuSelector = '.small-menu';

const animateBurgerMenu = () => {
    const body = document.body;
    const burgerIcon = document.querySelector(burgerIconSelector);    
    const content = document.querySelector(contentSelector);
    const overlay = document.querySelector(overlaySelector);
    const underlay = document.querySelector(underlaySelector);
    const smallMenu = document.querySelector(smallMenuSelector);

    let isOpened = false;
    let currentScroll = 0;
    let anchors = getAnchors();

    function getAnchors(){
        let anchorsInfo = {};
        let array = Array.from(smallMenu.children);
        array.forEach(elem => {
            let attr = elem.children[0].getAttribute('href');
            let clientY = document.getElementById(attr).getBoundingClientRect().top;
            clientY = Math.trunc(clientY)
            anchorsInfo[attr] = clientY;
        })
        return anchorsInfo;
    };
    const animateShift = () => {
        isOpened = !isOpened;
        burgerIcon.classList.toggle('active');
        content.classList.toggle('shift');
        overlay.classList.toggle('shift'); 
    };
    const freezScreen = scroll => {
        body.style.overflow = 'hidden';
        body.style.position = 'fixed';
        body.scrollTop = scroll;
        currentScroll = scroll;
        underlay.style.top = scroll + 'px';
    }
    const unFreezScreen = scrollY => {
        body.style.overflow = '';
        body.style.position = 'static';
        window.scrollTo(0 , scrollY);
    }

    burgerIcon.addEventListener('click', () => {
        let scroll = document.documentElement.scrollTop; 
        animateShift();      
        if(isOpened){
            freezScreen(scroll);
        }else{
            unFreezScreen(currentScroll);
        }
    });

    smallMenu.addEventListener('click', event => {
        if(event.target.tagName === 'A'){
            event.preventDefault();
            const id = event.target.getAttribute('href');
            let clientY = 0;
            for (let anchor in anchors){
                if(anchor === id){
                    clientY = anchors[anchor];
                    clientY = clientY - 55; //small-bar height
                    break;
                }
            };
            animateShift();
            unFreezScreen(clientY);
        }
    });
};