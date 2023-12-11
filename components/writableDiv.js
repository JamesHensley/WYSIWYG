import baseObj from './baseObj.js';

class writableDiv extends baseObj {
    constructor() {
        super({ templateUrl: '../components/writableDiv.html', classNames: ['wrapper'], readyCallBack: () => this.componentReady() });

        this.clickEvent = (e) => {
            const elem = this.shadow.elementFromPoint(e.x, e.y);
            const elemPath = getPath(elem);
            const reversedElem = getElemFromPath(elemPath);

            // console.log(elemPath);
            console.log(reversedElem);
        }

        this.initObserver = () => {
            let observer = new MutationObserver(this.mutationCallBack);
            observer.observe(this.contentDiv, { childList: true });
        }

        this.mutationCallBack = (mutations) => {
            const elemPath = mutations.reduce((t,n) => [].concat.apply(t, Array.from(n.addedNodes)), []).map(m => getPath(m));
            console.log(elemPath);
        }

        const getPath = (me) => {
            const getMyIndex = (me) => Array.from(me.parentElement.childNodes).filter(f => f.nodeName != '#text').findIndex(f => f == me);
            const iter = (me) => {
                return me != this.contentDiv ? [ getMyIndex(me), ...iter(me.parentElement) ] : [ getMyIndex(me) ];
            }
            return iter(me).reverse();
        }

        const getElemFromPath = (path) => {
            const iter = (p, idx) => Array.from(p.childNodes).filter(f => f.nodeName != '#text')[idx];

            return path.reduce((t, n) => iter(t, n), this.contentDiv?.parentElement);
        }
    }

    get contentDiv() { return this.wrapper.querySelector('.wsyiwygContent') }

    componentReady() {
        if (this.contentDiv) {
            this.contentDiv.addEventListener('click', this.clickEvent);
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
