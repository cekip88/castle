import { G_Bus } from "./G_Bus.js";

let prepareHandler = (e,dataEvent)=>{
		let
			item = e.target;

		if(!item || !item.closest) return void 0;
		let citem = item.closest(`[data-${dataEvent}]`);
		if(!citem) return void 0;
		return triggerWithEvent({'item':citem,'event':e},dataEvent);
	},
	triggerWithEvent = (data,currentAction) =>{
		if (!data['item'])  return void 0;
		let
			rawActions = data['item'].getAttribute(`data-${currentAction}`).split(';');
		for(let rAction of rawActions){
			let rawAction = rAction.split(':'),
				component = rawAction.splice(0,1)[0];
			for(let action of rawAction){
				G_Bus.trigger(component,action,data);
			}
		}
	}
class _G_Control{
	constructor(params={}){
		const _ = this;
		_.container = params?.container ?? document;
		_.handle();
	}

	clickHandler(e){
		try{
			return prepareHandler(e,'click');
		}catch(e){
			console.log(new Error(e));
		}

	}
	focusOutHandler(e){
		return prepareHandler(e,'outfocus');
	}
	changeHandler(e){return prepareHandler(e,'change');}
	inputHandler(e){
		return prepareHandler(e,'input');
	}
	keyUpHandler(e){
		return prepareHandler(e,'keyup');
	}
	keyDownHandler(e){
		return prepareHandler(e,'keydown');
	}
	submitHandler(e){
		return prepareHandler(e,'submit');
	}
	scrollHandler(e){
		let item = e.target;
		if(!item.dataset) return;
		if( ('scroll' in item.dataset) ){
			return triggerWithEvent({'item':item,'event':e},'scroll');
		}
	}
	overHandler(e){
		return prepareHandler(e,'over');
	}
	dragStartHandler(e){
		return prepareHandler(e,'dragStart');
	}
	dragOverHandler(e){
		return prepareHandler(e,'dragOver');
	}
	dragEnterHandler(e){
		return prepareHandler(e,'dragEnter')
	}
	dragLeaveHandler(e){
		return prepareHandler(e,'dragLeave');
	}
	dropHandler(e){
		return prepareHandler(e,'drop');
	}
	outHandler(e){
		return prepareHandler(e,'out');
	}
	leaveHandler(e){
		return prepareHandler(e,'leave');
	}
	handle(){
		const _  = this;
		_.container.addEventListener('click', _.clickHandler);
		_.container.addEventListener('focusout',_.focusOutHandler);
		_.container.addEventListener('submit',_.submitHandler);
		//_.container.addEventListener('contextmenu', _.contextHandler);
		_.container.addEventListener('change',_.changeHandler);
		_.container.addEventListener('input',_.inputHandler);
		_.container.addEventListener('keyup',_.keyUpHandler);
		_.container.addEventListener('keydown',_.keyDownHandler);
		_.container.addEventListener('mouseover',_.overHandler);
		_.container.addEventListener('mouseout',_.outHandler);
		_.container.addEventListener('mouseleave',_.leaveHandler);
		_.container.addEventListener('dragstart',_.dragStartHandler);
		_.container.addEventListener('dragenter',_.dragEnterHandler);
		_.container.addEventListener('dragleave',_.dragLeaveHandler);
		_.container.addEventListener('dragover',_.dragOverHandler);
		_.container.addEventListener('drop',_.dropHandler);
		_.container.addEventListener('scroll',_.scrollHandler);
	}
}

const G_Control = new _G_Control();

export { G_Control, G_Bus }