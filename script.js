const IMAGES = [
    {
      src: "https://images.unsplash.com/photo-1615195627275-48660e9cd84f",
      alt: "nebula cloud",
    },
    {
      src: "https://images.unsplash.com/photo-1570032257806-7272438f38da",
      alt: "mountains reflection on water",
    },
    { 
      src: "https://images.unsplash.com/photo-1525054098605-8e762c017741", 
      alt: "strong waves" 
    },
    {
      src: "https://images.unsplash.com/photo-1562207520-19c0ebd8264f",
      alt: "green mountains and blue sky",
    },
    {
      src: "https://images.unsplash.com/photo-1617191519105-d07b98b10de6",
      alt: "blue and purple galaxy",
    },
    {
      src: "https://images.unsplash.com/photo-1441829266145-6d4bfbd38eb4",
      alt: "blue wavy water",
    },
    {
      src: "https://images.unsplash.com/photo-1615114814213-a245ffc79e9a",
      alt: "brown and black galaxy",
    },
    {
      src: "https://images.unsplash.com/photo-1552604660-a8c4dde15b2e",
      alt: "person on clif in canyon",
    },
    {
      src: "https://images.unsplash.com/photo-1564295644023-16f14ac50b93",
      alt: "whale tale above water surface",
    },
  ];

const APP = document.querySelector('#app');

const createEl = (tag, attributes={}, events = {}) => {
    const el = document.createElement(tag);

    Object.entries(attributes).forEach(([attr, value]) => {
        if(typeof value !== 'object') {
            el[attr] = value;
        } else if (attr === 'data') {
            Object.keys(value).forEach(key => {
                el.dataset[key] = value[key]
            });
        }
    });

    Object.entries(events).forEach(([eventType, func]) => {
        el.addEventListener(eventType, func);
    });

    return el;
}

const createGalleryContainer = () => {
    const container = createEl('main', {
        className: 'gallery',
    });
    APP.appendChild(container);
}

const removeModal = ({ target }) => {
    const isModalImg = target.classList.contains('modal__img');
    const isArrow = target.classList.contains('arrow');
    if(!isModalImg && !isArrow) {
        const modalContainer = document.querySelector('.modal-container');
        // why do I need to use optional chaning to avoid error when clicking close btn?
        modalContainer?.remove();
        enableGalleryTabNavigaton();
    }
}

const disableGalleryTabNavigaton = () => {
    const galleryBtns = [...document.querySelectorAll('.gallery__button')];
    galleryBtns.forEach(btn => btn.tabIndex = -1);
}

const enableGalleryTabNavigaton = () => {
    const galleryBtns = [...document.querySelectorAll('.gallery__button')];
    galleryBtns.forEach(btn => btn.tabIndex = 0);
}

const renderModal = (el) => {
    const modalContainerExists = !!document.querySelector('.modal-container');

    if (!modalContainerExists) {
        const modalContainer = createEl('div', {
            className: 'modal-container'
        }, {
            click: removeModal,
        });
    
        const modal = createEl('div', {
            className: 'modal'
        });
    
        const closeModalBtn = createEl ('button', {
            className: 'modal__button--close',
            textContent: 'Close'
        }, {
            click: removeModal,
        });
    
        const modalImg = createEl('img', {
            className: 'modal__img',
            src: el.src,
            alt: el.alt,
            data: {
                imgIndex: el.dataset.imgIndex
            }
        });
    
        APP.appendChild(modalContainer);
        modalContainer.appendChild(modal);
        modal.appendChild(closeModalBtn);
        modal.appendChild(modalImg);
        renderArrows(modalContainer, el.dataset.imgIndex);
        disableGalleryTabNavigaton();
    }
}

const toggleArrows = nextImgIndex => {
    const leftArrow = document.querySelector('.arrow--left');
    const rightArrow = document.querySelector('.arrow--right');

    if(nextImgIndex === 0) {
        leftArrow.classList.add('hidden');
        return;
    }

    if(nextImgIndex === IMAGES.length - 1) {
        rightArrow.classList.add('hidden');
        return;
    }

    if(leftArrow.classList.contains('hidden')) {
        leftArrow.classList.remove('hidden');
    }

    if(rightArrow.classList.contains('hidden')) {
        rightArrow.classList.remove('hidden');
    }
}

const moveLeft = () => {
    const openImg = document.querySelector('.modal__img');
    const nextImgIndex = parseInt(openImg.dataset.imgIndex) - 1;
    toggleArrows(nextImgIndex);
    if(nextImgIndex >= 0) {
        openImg.src = IMAGES[nextImgIndex].src;
        openImg.alt = IMAGES[nextImgIndex].alt;
        openImg.dataset.imgIndex--;
    } 
}

const moveRight = () => {
    console.log('Called right arrow');
    const openImg = document.querySelector('.modal__img');
    const nextImgIndex = parseInt(openImg.dataset.imgIndex) + 1;
    toggleArrows(nextImgIndex);
    openImg.src = IMAGES[nextImgIndex].src;
    openImg.alt = IMAGES[nextImgIndex].alt;
    openImg.dataset.imgIndex++;
}

const renderArrows = (modalContainer, curIndex) => {
    const rightArrow = createEl('button', {
        className: 'arrow arrow--right'
    },
    {
        click: moveRight,
    });

    const leftArrow = createEl('button', {
        className: 'arrow arrow--left'
    },
    {
        click: moveLeft,
    });

    modalContainer.appendChild(rightArrow);
    modalContainer.appendChild(leftArrow);

    toggleArrows(parseInt(curIndex));
}


const createGalleryImgs = () => {
    IMAGES.forEach((image, index) => {
        const galleryImage = createEl('img', {
            className: 'gallery__image',
            src: image.src,
            alt: image.alt,
            data: {
                imgIndex: index
            }
        }, {
            click: function({ target }) {
                return renderModal(target);
            },
        });

        const galleryImageButton = createEl('button', {
            className: 'gallery__button',
        }, {
            keyup: function(event) {
                if(event.code === 'Enter') {
                    return renderModal(galleryImage);
                }
            },
        });

        const galleryContainer = document.querySelector('.gallery');
        galleryContainer.appendChild(galleryImageButton);
        galleryImageButton.appendChild(galleryImage); 
    })
}

const init = () => {
    createGalleryContainer();
    createGalleryImgs();
};

init();
