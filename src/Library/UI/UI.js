/*
 * This file is part of the KUBEjs package
 *
 * (c) Red Scotch Software Inc <kube+js@redscotch.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
(function(KUBE){
	"use strict";
	KUBE.LoadFactory('/Library/UI/UI',UI,['/Library/UI/Loader','/Library/Ajax/Client','/Library/DOM/DomJack','/Library/Extend/Object','/Library/Extend/Array','/Library/Extend/Date','/Library/Extend/Math']);

	UI.prototype.toString = function(){ return '[object '+this.constructor.name+']' };
	function UI(_DomJack){
        if(KUBE.Is(_DomJack,true) !== 'DomJack'){
            throw new Error('Failed to initialize User Interface, constructor must be a valid DomJack object');
        }
        var Root,Client,NotifyClient,nRequestManager,nResponseHandler,RequestTemplate,$API,UILoader,requestManager,responseHandler,notifications,lastNRun,nState,nPause,nThreshold;
        var UIGroundControl; //This is new

        UILoader = KUBE.Class('/Library/UI/Loader')();

        //Our API
        $API = {
            'SetGroundControl':SetGroundControl,
            'Connect':Connect,
            'BinaryTransmission': BinaryTransmission,
            'Broadcast':Broadcast,
            'AddViews':AddViews
        }.KUBE().create(UI.prototype);

        Root = UILoader.Create('Root');

        var rootDimensions = getRootDimensions(_DomJack);

        Root.Init({
            'UI':$API,
            'DomJackRoot':_DomJack
        },rootDimensions[0],rootDimensions[1]);

        Root.Once('delete',function(){
            throw new Error('The Root Node of the UI was deleted. This is an irrecoverable UI state.');
            Root = undefined;
        });

        $API.Root = Root;
        return $API;

        //Instruction processing
        function SetGroundControl(_UIGroundControl){
            if(KUBE.Is(_UIGroundControl) === 'object' && KUBE.Is(_UIGroundControl.Connect) === 'function'){
                UIGroundControl = _UIGroundControl;
            }
        }

        function Connect(_blockAddress,_target,_targetId){
            if(UIGroundControl !== undefined){
                return UIGroundControl.Connect(_blockAddress,_target,_targetId);
            }
        }

        function Broadcast(_blockAddress,_target,_targetId,_msg){
            if(UIGroundControl !== undefined){
                return UIGroundControl.Broadcast(_blockAddress,_target,_targetId,_msg);
            }
        }

        function BinaryTransmission(_blockAddress,_target,_targetId,_data){
            if(UIGroundControl !== undefined && KUBE.Is(UIGroundControl.StartBinaryTransmission) === "function"){
                return UIGroundControl.StartBinaryTransmission(_blockAddress,_target,_targetId,_data);
            }
            else{
                console.log("StartBinaryTransmission is not defined on GroundControl. Doing nothing");
            }
        }

        function AddViews(_viewPkg){
            return Root.AddViews(_viewPkg);
        }

        //function ProcessInstructions(_InstructionsObj){
        //    if(KUBE.Is(_InstructionsObj,true) === 'ViewInstructions'){
        //        var FoundView = Root.Find(_InstructionsObj);
        //        if(KUBE.Is(FoundView,true) === 'UIView'){
        //            if(_InstructionsObj.GetData()){
        //                FoundView.Update(_InstructionsObj.GetData());
        //            }
        //
        //            if(KUBE.Is(_InstructionsObj.GetChildViews()) === 'array'){
        //                FoundView.UpdateChildren(_InstructionsObj.GetChildViews(),_InstructionsObj.GetBehavior());
        //            }
        //        }
        //    }
        //}

        function getRootDimensions(_RootDJ){
            //So... what should I do with this? For now, take its width/height if they exist, otherwise go full screen. It is likely this should be more robust in the future to handle a variety of spaces
            var width,height;
            width = _RootDJ.Style().Width() || KUBE.Class('/Library/DOM/WinDocJack')().WindowWidth();
            height = _RootDJ.Style().Height() || KUBE.Class('/Library/DOM/WinDocJack')().WindowHeight();
            return [width,height];
        }

	}
}(KUBE));
