import baseObj from './baseObj.js';

class writableDiv extends baseObj {
    constructor() {
        super({
            templateUrl: '../components/writableDiv.html',
            docCss: './components/writableDiv.css',
            classNames: ['wrapper'],
            readyCallBack: () => this.componentReady()
        });

        this.contentClickEvent = (e) => {
            const elem = this.shadow.elementFromPoint(e.x, e.y);
            const elemPath = getPath(elem);
            const reversedElem = getElemFromPath(this.outlineDiv, elemPath);
            Array.from(this.outlineDiv.querySelectorAll('div')).forEach(f => f.classList.remove('active'));
            reversedElem != this.outlineDiv ? reversedElem.classList.add('active') : undefined;
        }

        this.outlineClickEvent = (e) => {
            const elem = this.shadow.elementFromPoint(e.x, e.y);
            // const elemPath = getPath(elem);
            // const reversedElem = getElemFromPath(this.contentDiv, elemPath);
            Array.from(this.outlineDiv.querySelectorAll('div')).forEach(f => f.classList.remove('active'));
            // reversedElem != this.outlineDiv ? reversedElem.classList.add('active') : undefined;
            elem != this.outlineDiv ? elem.classList.add('active') : undefined;
        }

        this.menuBtnClick = (className) => (e) => {
            const elemPath = getPath(this.outlineDiv.querySelector('.active'));
            const reversedElem = getElemFromPath(this.contentDiv, elemPath);
            if (reversedElem) {
                if (className == 'textNormal') {
                    Array.from(reversedElem.classList).forEach(f => reversedElem.classList.remove(f))
                }
                else if(reversedElem.classList.contains('textNormal')) {
                    reversedElem.classList.remove('textNormal');
                }

                if (reversedElem.classList.contains(className)) {
                    reversedElem.classList.remove(className);
                }
                else {
                    reversedElem.classList.add(className);
                }
            }
        }

        this.initObserver = () => {
            let observer = new MutationObserver(this.mutationCallBack);
            observer.observe(this.contentDiv, { childList: true });
        }

        this.mutationCallBack = (mutations) => {
            const elemPath = mutations.reduce((t,n) => [].concat.apply(t, Array.from(n.addedNodes)), []).map(m => getPath(m));
            this.outlineDiv && this.contentDiv ? this.outlineDiv.innerHTML = this.contentDiv.innerHTML : undefined;
        }

        const getPath = (me) => {
            const getMyIndex = (me) => Array.from(me.parentElement.childNodes).filter(f => f.nodeName != '#text').findIndex(f => f == me);
            const iter = (me) => {
                if (me == this.contentDiv || me == this.outlineDiv) { return [ getMyIndex(me) ] }
                return [ getMyIndex(me), ...iter(me.parentElement) ];
            }
            return iter(me).reverse().filter((f, i) => i != 0);
        }

        const getElemFromPath = (rootElem, path) => {
            const iter = (p, idx) => Array.from(p.childNodes).filter(f => f.nodeName != '#text')[idx];

            return path.reduce((t, n) => iter(t, n), rootElem);
        }
    }

    get contentDiv() { return this.wrapper.querySelector('.wsyiwygContent') }
    get outlineDiv() { return this.wrapper.querySelector('.wsyiwygOutline') }

    componentReady() {
        if (this.contentDiv && this.outlineDiv) {
            this.contentDiv.addEventListener('click', this.contentClickEvent);
            this.outlineDiv.addEventListener('click', this.outlineClickEvent);

            if (this.outlineDiv) {
                this.outlineDiv.innerHTML = this.contentDiv.innerHTML;

                Array.from(this.wrapper.querySelectorAll('.wsyiwygToolBtn'))
                .forEach(f => {
                    const handler = this.menuBtnClick(f.getAttribute('linked-class'));
                    f.addEventListener('click', handler);
                });
            }

            this.initObserver();
        }
    }

    connectedCallback() {
        // mediatorService.subscribe
    }

    disconnectedCallback() {
        // console.log('disconnectedCallback');
    }

    adoptedCallback() {
        // console.log('adoptedCallback');
    }

    attributeChangedCallback() {
        // console.log('attributeChangedCallback');
    }
}

export default writableDiv;
