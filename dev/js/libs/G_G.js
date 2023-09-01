export default class G_G{
	constructor(props){
		const _ = this;
		_.initedUpdate = false;
		_.handlersName = Symbol('handlers');
		_[_.handlersName] = [];

		//_.tempObj = {};

		_.stateName = Symbol('state');
		let validator = {
			get:(target,key) =>{
				if (typeof target[key] === 'object' && !_.isNull(target[key])) {
					if(!target['isProxy']){
						target['isProxy'] = false;
						return new Proxy(target[key], validator)
					}else{
						return target[key];
					}
				}
				return target[key];
			},
			set:(t,p,v)=>{

				Reflect.set(t,p,v);
				if(!_.deepEqual(t,_.tempObj)){
					_.tempObj = Object.assign({},t);
				}

				_.update([p]);
				return true;
			}
		}

		_[_.stateName] = new Proxy({},validator);
		_.start(props);
	}
	isNull(value){
		const _ =this;
		return value === null;
	}
	isObjects(obj1,obj2){
		return (typeof obj1 === 'object') && (typeof obj2 === 'object');
	}
	deepEqual( param1,param2 ) {
		const _ = this;
		let deep = false;
		if( param1 && param2){
			if((typeof param1 === 'object') && (typeof param2 === 'object')){
				let len1 = Object.getOwnPropertyNames(param1).length,
					len2 = Object.getOwnPropertyNames(param2).length;
				if(len1 === len2){
					let qual = false;
					for(let i = 0; i < len1; i++){
						qual = (Object.getOwnPropertyNames(param1)[i] === Object.getOwnPropertyNames(param2)[i]);
					}
					if(qual){
						for(let prop in param1){
							if( _.isObjects(param1[prop],param2[prop]) ) {
								deep = _.deepEqual(param1[prop],param2[prop]);
								if(!deep) break;
							}else if(param1[prop] !== param2[prop]){
								deep = false;
								break;
							}
							deep = true;
						}
						return deep;
					}
				}
			}
		}
		if(param1 === param2){
			deep =  true;
		}else{
			deep = false;
		}

		return deep;
	}
	defineDefineMethod(props){
		const _ = this;
		return new Promise( async (resolve) =>{
			if(!( (props?.define ?? 'define') in _) ){
				throw Error('G_G: No define method declared');
			}else{
				let method = await _[props?.define ?? 'define']();
				resolve(method);
			}
		})
	}
	/*	defineInitMethod(props){
			const _ = this;
			return new Promise( (resolve) =>{
				if(!( (props?.init ?? 'init') in _) ){
					throw Error('G_G: No initialization method declared');
				}else{
					resolve(_[props?.init ?? 'init']());
				}
			})
		}*/

	set(state){
		const _ = this;
		for(let prop in state){
			_[_.stateName][prop] = state[prop];
		}
		_._$ = _[_.stateName]
		return _._$;
	}

	/* Working with Dom methods */
	markup(domStr,isFragment=true){
		const _ = this;
		let
			fragment = document.createDocumentFragment(),
			parser= new DOMParser().parseFromString(domStr,'text/html');
		if(isFragment){
			fragment.append(...parser.body.children);
			return fragment;
		}

		return [...parser.body.children];
	}
	markupElement(domStr){
		const _ = this;
		let parser = new DOMParser().parseFromString(domStr,'text/html');
		return parser.body.children[0];
	}
	f(selector){
		let searchedItems =  document.querySelectorAll(selector);
		if( this instanceof HTMLElement ){
			searchedItems = this.querySelectorAll(selector);
		}
		if(!searchedItems.length) return null;
		if(searchedItems.length === 1) return  searchedItems[0];
		return searchedItems;
	}
	clear(domElement){
		if(!domElement) return void 0;
		if(domElement instanceof HTMLElement){
			domElement.innerHTML = null;
		}
	}
	/* Working with Dom methods */
	catchDepObj(dep){
		const _ = this;
		let obj = {};
		_[_.handlersName].forEach( (fnObj,index) => {
			let keys = Object.values(fnObj);
			for(let innerProp in fnObj) {
				if(fnObj.dep === dep){
					let stateProps = keys[1].split(',');
					for(let prop of stateProps){
						obj[prop] = _[_.stateName][prop];
					}
					break;
				}
			}
		});
		return obj;
	}
	update(props){
		const _ = this;
		if(!_[_.handlersName].length){
			return  void 0;
		}
		//console.log(_[_.handlersName]);
		if(!_.initedUpdate){
			_[_.handlersName].forEach( fnObj => {
				let obj;
				for(let innerProp in fnObj) {
					if(innerProp == ""){
						obj = Object.assign({},_[_.stateName]);
					}
					if(innerProp == 'dep') obj = _.catchDepObj(fnObj[innerProp]);
				}
				for(let innerProp in fnObj) {
					if(innerProp == 'dep') continue;
					fnObj[innerProp](obj);
				}
			});
		}
		if( (!props)  ){
			return void 0;
		}

		_[_.handlersName].forEach( fnObj => {
			let obj;
			for(let innerProp in fnObj) {
				if(innerProp == ""){
					obj = Object.assign({},_[_.stateName]);
				}
				if(innerProp == 'dep') obj = _.catchDepObj(fnObj[innerProp]);
			}
			for(let innerProp in fnObj){
				if(innerProp == 'dep') continue;
				if(~props.indexOf(innerProp)){
					fnObj[innerProp](obj);
				}else if(innerProp === '')	{
					fnObj[innerProp](obj);
				}
			}
		});
		//
	}
	_(fn,deps = []){
		const _ = this;
		if(!fn) return false;
		if(deps.length){
			let
				objDep = deps+'',
				propObj = { [deps[0].toString()] : fn,dep: objDep};
			if(!(~_[_.handlersName].indexOf(propObj))){
				_[_.handlersName].push(propObj);
			}
			/*	deps.forEach( (dep)=>{
					let propObj = { [dep.toString()] : fn,dep: objDep};
					if(!(~_[_.handlersName].indexOf(propObj))){
						_[_.handlersName].push(propObj);
					}
				});*/
		}else{
			let propObj = { [deps.toString()] : fn  };
			if(!(~_[_.handlersName].indexOf(propObj))){
				_[_.handlersName].push(propObj);
			}
		}
	}

	async start(props){
		const _ = this;
		await _.defineDefineMethod(props);
		//await _.defineInitMethod(props);
		await _.update();
		_.initedUpdate = true;
	}
}
