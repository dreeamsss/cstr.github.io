class СreatingArticles {
    constructor(options) {
        const defaultOptions = {
            triggeredOnSave: () => {},
        };

        this.options = Object.assign(defaultOptions, options);

        this.editorTitle = document.querySelector(".editor__title input");
        this.editorParagraph = document.querySelector(".editor__paragraph input");
        this.articleAddBtn = document.querySelector(".editor__btn[data-type=add]");
        this.articleSaveBtn = document.querySelector(".editor__btn[data-type=save]");

        this.title = "";
        this.paragraph = "";
        this.articleItem = this.createArticleElement("articles__item");
        this.articlePart = this.createArticleElement("articles__part");

        this.events();
        this.isVoided();
    }

    events() {

        this.editorTitle.addEventListener("input", (event) => {
            this.title = event.target.value;
            this.paragraph = this.editorParagraph.value;

            this.removeErrorClasses(event.target, "input-error");
    
            this.changeArticlePart(this.title, this.paragraph)
            this.isVoided();
            this.disabledButtons();
        });
    
        this.editorParagraph.addEventListener("input", (event) => {
            this.title = this.editorTitle.value;
            this.paragraph = event.target.value;
            
            this.removeErrorClasses(event.target, "input-error");

            this.changeArticlePart(this.title, this.paragraph)
            this.isVoided();
            this.disabledButtons();
        });
    
        this.articleAddBtn.addEventListener("click", () => {
            this.title = this.editorTitle.value;
            this.paragraph = this.editorParagraph.value;

            const isValid = this.validation();
            
            if(isValid) {
                this.articlePart = this.createArticleElement("articles__part");
                this.articleItem.setAttribute("data-confirmed", "")

                this.clearInputs();
            }

            this.disabledButtons();

        });
    
        this.articleSaveBtn.addEventListener("click", () => {
            console.log(1);
            if(!this.isVoided() && this.articleItem.hasAttribute("data-confirmed")) {
                this.options.triggeredOnSave();
                
                this.articleItem = this.createArticleElement("articles__item");
                this.articlePart = this.createArticleElement("articles__part");

                this.clearInputs();

                this.isVoided();
                
                this.disabledButtons();
            } 

        });
    }

    changeArticlePart(title, paragraph) {
        const articles = document.querySelector(".articles");

        this.articlePart.innerHTML = `
            <h2 class="articles__title">
                ${title}
            </h2>
            <p class="articles__paragraph">
                ${paragraph}
            </p>
        `;

        this.articleItem.append(this.articlePart);
        articles.append(this.articleItem);
    };

    createArticleElement(...classNames) {
        const elem = document.createElement("div");
        classNames.forEach(className => elem.classList.add(className));
        
        return elem;
    }

    clearInputs() {
        this.editorParagraph.value = "";
        this.editorTitle.value = "";
    }


    // ВАЛИДАЦИЯ

    validation() {
        if(this.editorTitle.value.length == 0) {
            this.addErrorClasses(this.editorTitle, "input-error");
        }

        if(this.editorParagraph.value.length == 0) {
            this.addErrorClasses(this.editorParagraph, "input-error");
        }

        if(this.editorParagraph.value.length > 0 && this.editorTitle.value.length > 0) {
            return true;
        }

        return false;
    }

    addErrorClasses(elem, className) {
        elem.classList.add(className);
    }

    removeErrorClasses(elem, className) {
        if(elem.classList.contains(className)) {
            elem.classList.remove(className);
        }
    }

    isVoided() {
        const articleAbsence = document.querySelector(".articles__absence");

        if(this.articleItem.textContent.trim().length) {    
            articleAbsence.hidden = true;
            return false;
        } else {
            articleAbsence.hidden = false;
            return true;
        }
    }

    disabledButtons() {
        if(!this.isVoided() && this.articleItem.hasAttribute("data-confirmed")) {
            this.articleSaveBtn.disabled = false;
            console.log(11231);
        } else {
            this.articleSaveBtn.disabled = true;
            console.log(2);

        }
    }
}
