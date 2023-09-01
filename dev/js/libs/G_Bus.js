class _G_Bus {
	constructor(flag){
		const _ = this;
		_.components = {};
		_.flag = flag;
	}
	on(component,eventName,fn,propertyName){
		const _ = this;
		let prop;
		if(_.flag === 'dev'){
			_.confirmLog(`Try to subscribe ${component.componentName ?? component} on ${eventName}`);
		}
		if (!component) return _;
		if(!fn){
			if(eventName instanceof Array){
				for(let event of eventName){
					if(!component[event]){
						_.errorLog(`Handler for this event: ['${event}'] not found in ('${component['componentName']}') component`);
						return _;
					}
					fn = component[event].bind(component);
				}
			}else{
				if(!component[eventName]){
					_.errorLog(`Handler for this event: [${eventName}] not found`);
					return _;
				}
				fn = component[eventName].bind(component);
			}
		}
		if(!component.busProp){
			prop = fn.name.replace('bound ','');
		}else{
			prop = component.busProp;
		}
		if(propertyName){
			prop = propertyName;
		}
		let componentName;
		if(typeof component == 'object'){
			componentName = component.componentName.toLowerCase();
		}else{
			componentName = component;
		}

		if(!_.components[componentName]){
			_.components[componentName] = {};
			_.components[componentName]['events'] = new Map();
		}
		let handle = (eventName,type,fn) =>{
			if(!fn)	fn = component[eventName].bind(component);
			prop  = fn.name.replace('bound ','');
			if(!_.components[componentName]['events'].has(eventName)){
				// If event not exists in component events list
				_.components[componentName]['events'].set(eventName,new Map());
			}
			let currentEvents = _.components[componentName]['events'].get(eventName);
			if(!currentEvents.has(prop)){
				currentEvents.set(prop, fn);
				if(_.flag === 'dev'){
					_.confirmLog(`Subscribed on event ${ eventName } on fn: ${ prop } of component ${component}`);
				}
				return _
			}

		}
		if(eventName instanceof Array){
			for(let event of eventName){
				handle(event,'arr')
			}
		}else{
			handle(eventName,'',fn)
		}
		return _
	}
	trigger(componentName,eventName,data){
		const _ = this;
		componentName = componentName.toLowerCase();
		return new Promise(async (resolve,reject) => {
			if(_.flag === 'dev'){
				console.log(`Component ${componentName}: Event start ${eventName} with data:`,data);
			}
			try{
				let hasEvents = _.components[componentName]['events'].has(eventName);
				if(hasEvents){
					let currentEvents = _.components[componentName]['events'].get(eventName);
					for (let item of currentEvents.values()){
						let handler = await item(data);
						resolve(handler);
					}
				}
			} catch (e) {
				if(e.stack){
					let
						stackLines = e.stack.split('\n'),
						error= stackLines[0].trim(),
						handle = stackLines[1].trim();
					_.errorLog(`Error in ${componentName}:${eventName}\n${error}\n${handle}`);
				}
				reject(e);
			}
		});
	}

	remove(component,eventName,prop){
		const _ = this;
		let componentName;
		if(typeof component == 'object'){
			componentName = component.componentName.toLowerCase();
		}else{
			componentName = component;
		}
		let hasEvents = _.components[componentName]['events'].has(eventName);
		if (hasEvents) {
			_.components[componentName]['events'].delete(eventName);
		}
	}
	clear(component){
		const _ = this;
		let componentName;
		if(typeof component == 'object'){
			componentName = component.componentName.toLowerCase();
		}else{
			componentName = component;
		}
		delete _.components[componentName];
	}
	errorLog(text){
		const _ = this;
		let styles= `
			background: #1c1c1c 16px center no-repeat url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEwIDJDMTQuNDEgMiAxOCA1LjU5IDE4IDEwQzE4IDE0LjQxIDE0LjQxIDE4IDEwIDE4QzUuNTkgMTggMiAxNC40MSAyIDEwQzIgNS41OSA1LjU5IDIgMTAgMlpNMTAgMEM0LjQ4IDAgMCA0LjQ4IDAgMTBDMCAxNS41MiA0LjQ4IDIwIDEwIDIwQzE1LjUyIDIwIDIwIDE1LjUyIDIwIDEwQzIwIDQuNDggMTUuNTIgMCAxMCAwWiIgZmlsbD0iI0ZGNDY2NyIgZmlsbC1vcGFjaXR5PSIwLjkiLz4KPHBhdGggZD0iTTkgMTFMOSA1QzkgNC40NSA5LjQ1IDQgMTAgNEMxMC41NSA0IDExIDQuNDUgMTEgNUwxMSAxMUMxMSAxMS41NSAxMC41NSAxMiAxMCAxMkM5LjQ1IDEyIDkgMTEuNTUgOSAxMVoiIGZpbGw9IiNGRjQ2NjciIGZpbGwtb3BhY2l0eT0iMC45Ii8+CjxyZWN0IHg9IjkiIHk9IjE0IiB3aWR0aD0iMiIgaGVpZ2h0PSIyIiByeD0iMSIgZmlsbD0iI0ZGNDY2NyIgZmlsbC1vcGFjaXR5PSIwLjkiLz4KPC9zdmc+Cg==");
			background-size:20px;
			padding: 10px 10px 10px 50px;
			display: flex;
			border-left:2px solid #FF6F6F;color:rgba(255, 255, 255, 0.6);
		`;
		console.log(`%c%s`,styles,text);
	}
	confirmLog(text){
		const _ = this;
		let styles= `
			background: #1c1c1c 16px center no-repeat url("data:image/svg+xml;base64");
			background-size:20px;
			padding: 5px 10px;
			display: flex;
			border-left:2px solid #4989dc;
			color: #4989dc;
			font-weight: bold;
		`;
		console.log(`%c%s`,styles,text);
	}
}
export const G_Bus = new _G_Bus('prod');
window['G_Bus'] = G_Bus;