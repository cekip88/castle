import G_G from "./libs/G_G.js";
import { G_Bus } from "./libs/G_Control.js";
class Front extends G_G{
  constructor(){
    super();
    const _ = this;
    G_Bus
	    .on(_,'burgerClick',_.burgerClick.bind(_))
	    .on(_,'galleryPrev',_.galleryPrev.bind(_))
	    .on(_,'galleryNext',_.galleryNext.bind(_))
	    .on(_,'soloSlideChange',_.soloSlideChange.bind(_))
	    .on(_,'showModal',_.showModal.bind(_))
	    .on(_,'closeModal',_.closeModal.bind(_))
	    .on(_,'closeModalByBgc',_.closeModalByBgc.bind(_))
	    .on(_,'changeLoginForm',_.changeLoginForm.bind(_))
  }
  define(){
    const _ = this;
    _.componentName = 'front';
    _.head = _.f('.head');
    _.body = document.body;
    _.resolution = _.getResolution();
    _.init();
  }

	showModal({item}){
  	const _ = this;
  	let bgc = _.f('.popup');
  	let modalSelector = item.getAttribute('data-target');
  	if (!modalSelector) return;

  	let modal = _.f(`${modalSelector}`);
  	_.activeModalParent = modal.parentElement;
  	bgc.classList.add('active');
  	bgc.append(modal);
  	_.body.classList.add('noScroll');
  	modal.prepend(_.markup(`
  	  <button class="popup-close" data-click="${_.componentName}:closeModal">
				<svg>
					<use xlink:href="/img/sprite.svg#popup-close"></use>
				</svg>
			</button>
		`))

  	setTimeout(()=>{
		  modal.classList.add('visible');
	  })
	}
	closeModal({item}){
  	const _ = this;

  	let modal = item.parentElement;
  	modal.classList.remove('visible');

  	setTimeout(()=>{
			_.body.classList.remove('noScroll');
		  _.f('.popup').classList.remove('active');
  		_.activeModalParent.append(modal);
  		item.remove();
	  },350)
	}
	closeModalByBgc({item,event}){
  	const _ = this;
  	if (!event.target.classList.contains('popup')) return;

  	let closeBtn = item.querySelector('.popup-close');
  	if (!closeBtn) return;

  	_.closeModal({item:closeBtn})
	}

	burgerClick({item}){
  	const _ = this;
  	_.head.classList.toggle('active');
  	_.body.classList.toggle('notScrollable')
	}
	
	soloSlidersInit(){
  	const _ = this;
  	let sliders = document.querySelectorAll('.solo-slider');
  	sliders.forEach((slider)=>{
  		_.soloSliderInit(slider);
	  })
	}
	soloSliderInit(slider){
  	const _ = this;
  	let
		  slides = slider.querySelector('.solo-slides'),
		  control = slider.querySelector('.solo-slider-control'),
		  slidesCount = slides.children.length;
  	
  	control.innerHTML = '';
  	if (!slides.querySelector('.active')) slides.firstElementChild.classList.add('active');
  	
  	let maxHeight = 0;
  	for (let i = 0; i < slidesCount; i++) {
  		let
			  slide = slides.children[i],
			  active = slide.classList.contains('active');
  		
  		if (maxHeight < slide.clientHeight) maxHeight = slide.clientHeight;
  		
  		slide.classList.add('solo-slide');
		  slide.setAttribute('data-index',i.toString())
  		control.innerHTML += _.getDotTpl(active,i);
	  }
  	
  	slides.style = `height:${maxHeight}px;`;
		
		let touchstartX,touchendX;
		slider.addEventListener('touchstart', e => {
			touchstartX = e.changedTouches[0].screenX
		})
		
		slider.addEventListener('touchend', e => {
			touchendX = e.changedTouches[0].screenX
			if (touchendX < touchstartX) {
				let nextSlide = slides.querySelector('.active').nextElementSibling;
				if (!nextSlide) nextSlide = slides.children[0];
				_.soloSlideChange({item:nextSlide});
			} else if (touchendX > touchstartX) {
				let prevSlide = slides.querySelector('.active').previousElementSibling;
				if (!prevSlide) prevSlide = slides.children[slidesCount - 1];
				_.soloSlideChange({item:prevSlide});
			}
		})
	}
	soloSlidersReInit(){
		const _ = this;
		let sliders = document.querySelectorAll('.solo-slider');
		sliders.forEach((slider)=>{
			_.soloSliderReInit(slider);
		})
	}
	soloSliderReInit(slider){
		let
			slides = slider.querySelector('.solo-slides'),
			slidesCount = slides.children.length;
		let maxHeight = 0;
		slides.style = '';
		slides.classList.add('noTransition');
		let active = slides.querySelector('.active');
		if (active) active.classList.remove('active');
		setTimeout(()=>{
			for (let i = 0; i < slidesCount; i++) {
				let slide = slides.children[i];
				if (maxHeight < slide.clientHeight) maxHeight = slide.clientHeight;
			}
			if (active) active.classList.add('active');
			slides.style = `height:${maxHeight}px;`;
			slides.classList.remove('noTransition');
		})
	}
	getDotTpl(active = false,index){
  	const _ = this;
  	return `
  	  <button class="main-slider-dot${active ? ' active' : ''}" data-index="${index}" data-click="${_.componentName}:soloSlideChange"></button>
  	`;
	}
	soloSlideChange({item}){
  	const _ = this;
  	let
		  slider = item.closest('.solo-slider'),
		  index = item.getAttribute('data-index'),
		  slides = slider.querySelector('.solo-slides'),
		  control = slider.querySelector('.solo-slider-control');
  	
  	if (item.classList.contains('dot')) {
  		if (item.classList.contains('active')) return;
	  }
	  
	  control.querySelector('.active').classList.remove('active');
		control.querySelector(`[data-index="${index}"]`).classList.add('active');
		
		slides.querySelector('.active').classList.remove('active');
		slides.querySelector(`[data-index="${index}"]`).classList.add('active');
	}
	
	gallerySlidersInit(){
  	const _ = this;
  	let gallerySliders = document.querySelectorAll('.gallery-slider');
  	gallerySliders.forEach((slider)=>{
  		_.gallerySliderInit(slider);
	  })
	}
	gallerySliderInit(slider){
  	const _ = this;
  	
  	if (window.innerWidth >= 1200) {
		  let
			  slides = slider.querySelector('.gallery-slides');
		  slides.firstElementChild.style = 'opacity:0.6;';
		  slides.children[2].style = 'opacity:0.6;';
	  }
		
		let touchstartX,touchendX;
		slider.addEventListener('touchstart', e => {
			touchstartX = e.changedTouches[0].screenX
		})
		slider.addEventListener('touchend', e => {
			touchendX = e.changedTouches[0].screenX
			if (touchendX < touchstartX) {
				_.galleryNext({item:slider});
			} else if (touchendX > touchstartX) {
				_.galleryPrev({item:slider});
			}
		})
	}
	gallerySlidersReInit(){
		const _ = this;
		let gallerySliders = document.querySelectorAll('.gallery-slider');
		gallerySliders.forEach((slider)=>{
			_.gallerySliderReInit(slider);
		})
	}
	gallerySliderReInit(slider){
		let
			slides = slider.querySelector('.gallery-slides');
		if (window.innerWidth >= 1200) {
			slides.firstElementChild.style = 'opacity:0.6;';
			slides.children[2].style = 'opacity:0.6;';
		} else {
			slides.firstElementChild.removeAttribute('style');
			slides.children[2].removeAttribute('style');
		}
	}
	galleryPrev({item}){
  	const _ = this;
  	let
		  slider = item.closest('.gallery-slider'),
		  slides = slider.querySelector('.gallery-slides');
  	
  	if (window.innerWidth >= 1200) {
		  if (_.galleryStop) return;
		  _.galleryStop = true;
		  slides.children[2].removeAttribute('style');
		  setTimeout(()=>{
			  slides.prepend(slides.lastElementChild);
			  slides.children[1].removeAttribute('style');
			  slides.children[2].style = 'opacity:0.6;';
			  setTimeout(()=>{
				  slides.firstElementChild.style = 'opacity:0.6;';
			  },350);
			  _.galleryStop = false;
		  },350);
	  } else {
  	  slides.prepend(slides.lastElementChild)
	  }
	}
	galleryNext({item}){
  	const _ = this;
		let
			slider = item.closest('.gallery-slider'),
			slides = slider.querySelector('.gallery-slides');
		
		if (window.innerWidth >= 1200) {
			if (_.galleryStop) return;
			_.galleryStop = true;
			slides.firstElementChild.removeAttribute('style');
			setTimeout(()=>{
				slides.append(slides.firstElementChild);
				slides.firstElementChild.style = 'opacity:0.6;';
				slides.children[1].removeAttribute('style');
				setTimeout(()=>{
					slides.children[2].style = 'opacity:0.6;';
				},350);
				_.galleryStop = false;
			},350)
		} else {
			slides.append(slides.firstElementChild)
		}
	}

	changeLoginForm({item}){
		const _ = this;
		if (item.classList.contains('active')) return;

		let loginCont = item.closest('.popup-login');
		let targetId = item.getAttribute('data-target');
		let forms = loginCont.querySelectorAll('.form');
		let nav = loginCont.querySelector('.login-header');
		nav.querySelector('.active').classList.remove('active');
		nav.querySelector(`[data-target="${item.getAttribute('data-target')}"]`).classList.add('active');
		forms.forEach(form=>{
			if (form.id == targetId) form.classList.add('active');
			else form.classList.remove('active');
		})
	}

	headNavActivePageShow(){
  	const _ = this;
  	let navBtns = _.f('a.head-nav-link');
  	navBtns.forEach(link=>{
		  if (location.href.indexOf(link.href) >= 0) link.classList.add('active')
	  })
	}

	getResolution(){
  	let
		  resolution = '',
		  width = window.innerWidth;
		if (width < 768) resolution = 'mobile';
		else if (width < 1024) resolution = 'tablet';
		else if (width < 1200) resolution = 'tablet-large';
		else resolution = 'desktop';
  	return resolution;
	}
	changeResolution(){
  	const _ = this;
  	let resolution = _.getResolution();
  	if (!_.resolution || _.resolution != resolution) {
  		_.resolution = resolution;
  		_.reInits();
	  }
	}

	reInits(){
  	const _ = this;
		_.soloSlidersReInit();
		_.gallerySlidersReInit();
	}
	
	init(){
  	const _ = this;
  	_.soloSlidersInit();
  	_.gallerySlidersInit();
  	_.headNavActivePageShow();
  	
  	window.addEventListener('resize',(e)=>{
  		_.changeResolution();
	  })
	}
}
new Front();