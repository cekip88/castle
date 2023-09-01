import G_G from "./libs/G_G.js";
import { G_Bus } from "./libs/G_Control.js";
class Front extends G_G{
  constructor(){
    super();
    const _ = this;
    G_Bus.on(_,'burgerClick',_.burgerClick.bind(_))
  }
  define(){
    const _ = this;
    _.componentName = 'front';
    _.head = _.f('.head');
    _.body = document.body;
  }

	burgerClick({item}){
  	const _ = this;
  	_.head.classList.toggle('active');
  	_.body.classList.toggle('notScrollable')
	}
}
new Front();