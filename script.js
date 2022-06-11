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
            click: function() {
                return renderModal(galleryImage);
            } 
        });

        const galleryContainer = document.querySelector('.gallery');
        galleryContainer.appendChild(galleryImageButton);
        galleryImageButton.appendChild(galleryImage); 
    })
}

const renderModal = (el) => {
    const modalContainerExists = !!document.querySelector('.modal-container');

    if (!modalContainerExists) {
        const modalContainer = createEl('div', {
            className: 'modal-container'
        }, {
            click: function({ target }) {
                const isModalImg = target.classList.contains('modal__img');
                const isArrow = target.classList.contains('arrow');
                if (!isModalImg & !isArrow) {
                    removeModal();
                }
            },
        });
    
        const modal = createEl('div', {
            className: 'modal'
        });
    
        const closeModalBtn = createEl ('button', {
            className: 'modal__button--close',
        });

        const imgContainer = createEl('div', {
            className: 'modal__img__container',
        })
    
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
        modal.appendChild(imgContainer);
        imgContainer.appendChild(closeModalBtn);
        imgContainer.appendChild(modalImg);
        renderArrows(modalContainer, el.dataset.imgIndex);
        disableGalleryTabNavigaton();
    }
}

const renderArrows = modalContainer => {
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
}

const moveLeft = () => {
    const openImg = document.querySelector('.modal__img');
    const nextImgIndex = parseInt(openImg.dataset.imgIndex) - 1;
    if(nextImgIndex >= 0) {
        openImg.src = IMAGES[nextImgIndex].src;
        openImg.alt = IMAGES[nextImgIndex].alt;
        openImg.dataset.imgIndex--;
    } else {
        openImg.src = IMAGES[IMAGES.length - 1].src;
        openImg.alt = IMAGES[IMAGES.length - 1].alt;
        openImg.dataset.imgIndex = IMAGES.length - 1;
    }
}

const moveRight = () => {
    const openImg = document.querySelector('.modal__img');
    const prevImgIndex = parseInt(openImg.dataset.imgIndex) + 1;
    if(prevImgIndex <= IMAGES.length - 1) {
        openImg.src = IMAGES[prevImgIndex].src;
        openImg.alt = IMAGES[prevImgIndex].alt;
        openImg.dataset.imgIndex++;
    } else {
        openImg.src = IMAGES[0].src;
        openImg.alt = IMAGES[0].alt;
        openImg.dataset.imgIndex = 0;
    }
}

const removeModal = () => {
    const modalContainer = document.querySelector('.modal-container');
    modalContainer.remove();
    enableGalleryTabNavigaton();
}

const disableGalleryTabNavigaton = () => {
    const galleryBtns = [...document.querySelectorAll('.gallery__button')];
    galleryBtns.forEach(btn => btn.tabIndex = -1);
}

const enableGalleryTabNavigaton = () => {
    const galleryBtns = [...document.querySelectorAll('.gallery__button')];
    galleryBtns.forEach(btn => btn.tabIndex = 0);
}

const init = () => {
    createGalleryContainer();
    createGalleryImgs();
    document.addEventListener('keyup', event => {
        if(event.code === 'Escape') {
            removeModal();
        }
    })
};

init();
