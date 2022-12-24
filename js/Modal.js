class Modal {
    constructor(options) {
        const defaultOptions = {
            isOpen: () => {},
            isClosed: () => {},
        };

        this.options = Object.assign(defaultOptions, options);
        this.modal = document.querySelector(".modal");
        this.isOpen = false;
        this.modalContainer = false;
        this.previousActiveElement = false;
        this.animation = false;
        this.fixBlocks = document.querySelectorAll('.fix-block');
        this.speed = 300;
        this.focusElements = [
            "input",
            "select",
            "button",
            "textarea",
            "a[href]",
            "[tabindex]"
        ];

        this.events();

    }

    events() {
        if(this.modal) {
            const pathButtons = document.querySelectorAll("[data-path]");
            pathButtons.forEach(btn => {
                btn.addEventListener("click", function(event) {
                
                    const target = event.currentTarget.dataset.path;
                    const animation = event.currentTarget.dataset.animation;
                    const speed = event.currentTarget.dataset.speed;

                    this.animation = animation ? animation : 'fade';
                    this.speed = speed ? parseInt(speed) : 300;
                    this.modalContainer = document.querySelector(`[data-target="${target}"]`);
                    this.open();
                }.bind(this));
            });

            this.modal.addEventListener("click", function(event) {

                if(event.target.closest(".modal__close")) {
                    this.close();
                    return;
                }

                if(!event.target.closest(".modal__container") && this.isOpen && !event.target.closest('.mini-product__delete')) {
                    this.close();
                    return;
                }
                
            }.bind(this));

            document.addEventListener("keydown", function(event) {
                if (event.code == "Escape" && this.isOpen) {
                    this.close();
                }

                if (event.code == "Tab" && this.isOpen) {
                    this.focusCatch(event);
                }
            }.bind(this));
        }

    }

    open() {
        this.previousActiveElement = document.activeElement;

        this.modal.style.setProperty('--transition-time', `${this.speed / 1000}s`);
        this.modal.classList.add("is-open");
        this.disableScroll();
        
        this.modalContainer.classList.add("modal-open");
        this.modalContainer.classList.add(this.animation);
        
        setTimeout(() => {
            this.options.isOpen(this);
            this.modalContainer.classList.add('animate-open');
            this.isOpen = true;
            this.focusTrap(); 
        }, this.speed);
    }

    close() {
        this.modalContainer.classList.remove('animate-open');
		this.modalContainer.classList.remove(this.animation);
        this.isOpen = false;
        this.options.isClosed();
        this.modalContainer.classList.remove("modal-open");
        
        this.enableScroll();
        this.modal.classList.remove("is-open");

        this.focusTrap();
    }

    focusCatch(event) {
        const focusable = this.modalContainer.querySelectorAll(this.focusElements);
        const focusArray = Array.prototype.slice.call(focusable);
        const focusedIndex = focusArray.indexOf(document.activeElement);

        if(focusArray.length) {
            if(event.shiftKey && focusedIndex == 0) {
                focusArray[focusArray.length - 1].focus();
                event.preventDefault();
            }
    
            if(!event.shiftKey && focusedIndex == focusArray.length - 1) {
                focusArray[0].focus();
                event.preventDefault();
            }
        }
    }

    focusTrap() {
        const focusable = this.modalContainer.querySelectorAll(this.focusElements);

        if(this.isOpen && focusable.length) {
            setTimeout(() => {
                focusable[0].focus();
            }, 200);
        } else {
            this.previousActiveElement.focus();
        }
    }

    disableScroll() {
        let pagePosition = window.scrollY;
        this.lockPadding();
        document.body.classList.add("disable-scroll");
        document.body.dataset.position = pagePosition;
        document.body.style.top = -pagePosition + "px";
    }

    enableScroll() {
        let pagePosition = parseInt(document.body.dataset.position, 10);
        this.unlockPadding();
        document.body.classList.remove("disable-scroll");
        document.body.style.top = "auto";
        window.scroll({top: pagePosition, left: 0});
        document.body.removeAttribute("data-position");
    }

    lockPadding() {
        let paddingOffset = window.innerWidth - document.body.offsetWidth + "px";
        this.fixBlocks.forEach(item => {
            item.style.paddingRight = paddingOffset;
        });

        document.body.style.paddingRight = paddingOffset;
    }

    unlockPadding() {
        this.fixBlocks.forEach(item => {
            item.style.paddingRight = 0;
        });

        document.body.style.paddingRight = 0;
    }

}
