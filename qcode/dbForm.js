function dbForm(oForm) { 

// Methods
oForm.save=save;
oForm.formAction = formAction;
oForm.focus = focus;
oForm.nav=nav;
oForm.find=find;
oForm.del=del;

// Parameters
if (dbFormData.formType == undefined) { dbFormData.formType = 'update' } 
if (oForm.enabled == undefined) { oForm.enabled = "true" }
if (oForm.checkOnExit == undefined) { oForm.checkOnExit = "true" }
if (oForm.initialFocus == undefined) { oForm.initialFocus = "true" }
// vars
var state;
var error;
var oDivStatus;
var elmts=new Array;

// Events onFormActionReturn

// Init
init();
//

function init() {
  // defaults;
  state = 'current';
  
  // Find the form's status div
  var divs = oForm.getElementsByTagName('DIV');
  for(var i=0;i<divs.length;i++) {
    var oDiv = divs[i];
    if ( oDiv.className == 'clsDbFormDivStatus') {
      oDivStatus = oDiv;
    }
  }
  
    $(oForm).find('input, select, textarea').each(function(){
	elmts.push($(this)[0]);
    });
  
  var e = oForm.getElementsByTagName('DIV');
  for(var i=0;i<e.length;i++) {
    if ( e[i].className == 'clsDbFormHTMLArea' || e[i].className == 'clsRadioGroup' ) {
      elmts.push(e[i]);
    }
  }
  
  if ( dbFormData.dataURL !=undefined ) {
    formAction('requery',oForm.dataURL);
  }
  if ( dbFormData.qryURL !=undefined ) {
    nav('FIRST');
  }
  // Look for dropdowns and attach onchange behavior
  for(var i=0;i<elmts.length;i++) {
    var elmt = elmts[i];
    if (elmt.tagName=='SELECT') {
      elmt.attachEvent('onchange',setDirty);
    }
    if (elmt.tagName=='INPUT' && elmt.type=='checkbox') {
      elmt.attachEvent('onclick',setDirty);
    }
    if (elmt.tagName=='INPUT' && elmt.type=='radio') {
      elmt.attachEvent('onclick',setDirty);
    }
  }
  
  // document unload
  if ( oForm.checkOnExit == "true" && dbFormData.formType=="update") {
    window.attachEvent('onbeforeunload',onBeforeUnload);
  }
  oForm.attachEvent('onkeydown',onKeyDown);
  oForm.attachEvent('onkeypress',onKeyPress);
  oForm.attachEvent('onsubmit',onSubmit);
  if ( oForm.initialFocus == "true" ) {
    focus();
  }
  if (oForm.initialFind!=undefined) {
      var name=oForm.initialFind.split('=')[0];
      var value=oForm.initialFind.split('=')[1];
      find(name,value);
  }
}
 
function focus() {
   // Find the first control to focus on
 out: {
   for (var i=0;i<oForm.elements.length;i++) {
     var ctl = oForm.elements[i];
     try {
       ctl.focus();
       break out;
     } catch(e) {
       var e;
       continue;
     }
   }
 }
 }

function onBeforeUnload() {
   if ( state == 'dirty' ) {
     if (window.confirm('Do you want to save your changes?')) {
       oForm.save();
       if (state == 'error' ) {
	 event.returnValue = "Your changes could not been saved.\nStay on the current page to correct.";
       }
     }
   }
   oForm.save=undefined;
   oForm.formAction=undefined;
   oForm.focus=undefined;
}

function onSubmit() {
  if ( dbFormData.formType == 'submit' ) {
    return true;
  }
  return false;
}

function onKeyDown() {
  var e = window.event;
  if ( e.keyCode == 83 && e.ctrlKey ) {
    // Ctrl+S
    oForm.save();
    e.returnValue = false;
  }
  // Backspace
  if ( e.keyCode == 8) {
    setState('dirty');
  }
}

function onKeyPress() {
  setState('dirty');
}

function setDirty() {
  setState('dirty');
}

function setState(newState) {
 out: {
   if ( newState == 'dirty' ) {
     var span ='<span style="color:blue;cursor:hand;text-decoration:underline" onclick="' + oForm.id + '.save()">save</span>';
     setStatus('Editing ... To ' + span + ' type Ctrl+S');
     if ( oForm.nav_new) {
       if ( dbFormData.addURL ) {
	 oForm.nav_new.disabled=false;
       } else {
	 oForm.nav_new.disabled=true;
       }
     }
     if ( oForm.nav_prev ) {
       oForm.nav_prev.disabled=false;
       oForm.nav_next.disabled=false;
     }
     break out;
   }
   if ( newState == 'updating' ) {
     setStatus('Updating ...');
     break out;
   }
   if ( newState == 'current' ) {
     if ( state =='updating' ) {
       setStatus('Saved.');
     } else if (state=='loading') {
       setStatus('');
     } else if (state=='deleting') {
       setStatus('Deleted.');
     } else {
       setStatus('');
     }
     break out;
   }
   if ( newState == 'error' ) {
     break out;
   }
 }
 state = newState;
}

function save(async) {
  if ( dbFormData.formType == 'update' ) {
    setState('updating');
    formAction('update',dbFormData.updateURL);
  }
  if ( dbFormData.formType == 'add' ) {
    setState('updating');
    formAction('add',dbFormData.addURL);
  }
  if ( dbFormData.formType == 'submit' ) {
    // oForm submit
    oForm.action = dbFormData.submitURL;		
    for(var i=0;i<elmts.length;i++) {
      var elmt = elmts[i];
      if ( elmt.tagName=='DIV' && elmt.className == 'clsDbFormHTMLArea' ) {
	var oInput = document.createElement('INPUT');
	oInput.type='hidden';
	oInput.name = elmt.name;
	oInput.value= elmt.innerHTML;
	oForm.appendChild(oInput);
      }
      if ( elmt.tagName=='INPUT' && elmt.type == 'checkbox' && elmt.boolean && elmt.checked!=true) {
	var oInput = document.createElement('INPUT');
	oInput.type='hidden';
	oInput.name = elmt.name;
	oInput.value= "false";
	oForm.appendChild(oInput);
      }
    }
    oForm.submit();
  }
}

function del() {
  if ( window.confirm('Delete the current record?') ) {
    setState('deleting');
    formAction('delete',dbFormData.deleteURL);
  }
}

function nav(navTo) {
   oForm.navTo.value = navTo;
   if ( state=='dirty' ) {
     oForm.save();
   } else {
     setState('loading');
     formAction('qry',dbFormData.qryURL);
   }
}

function find() {
  if ( state=='dirty' ) {
    oForm.save();
  } else {
    setState('loading');
  }
  handler = formActionReturn;
  var url = dbFormData.searchURL;
  var xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
  xmlhttp.open("POST",url,false);
  var action = new Object;
  action.type = 'search';
  action.xmlhttp = xmlhttp;
  
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4) handler(action);
  }
    var data = "action=search";
    for(var i = 0; i < arguments.length; i += 2){
	data = data + "&" + encodeURIComponent(arguments[i]) + "=" + encodeURIComponent(arguments[i+1]);
    }
  xmlhttp.Send(data);
}

function formAction(type,url,handler,async) {
  if ( handler == undefined ) {
    handler = formActionReturn;
  }
  if ( async == undefined ) {
    async = false;
  }
  var xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
  xmlhttp.open("POST",url,async);
  var action = new Object;
  action.type = type;
  action.xmlhttp = xmlhttp;
  
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4) handler(action);
  }
  xmlhttp.Send(formEncode(oForm));
}


function formActionReturn(action) {
  var xmlhttp = action.xmlhttp;	
  var type = action.type;
  var xmlDoc = xmlhttp.responseXML;
  var error;
  // HTTP ERROR
  if ( xmlhttp.status != 200 ) {
    error = "Error ! Expected response 200 but got " + xmlhttp.status;
    setState('error');
    setStatus(error);
    alert("Your changes could not be saved.\n" + error);
    return false;
  }
  // XML ERROR
  var xmlError = xmlDoc.parseError;
  if (xmlError.errorCode != 0) {
    error = "Error ! " + xmlError.reason;
    setState('error');
    setStatus(error);
    alert("Your changes could not be saved.\n" + error);
    return false;
  }
  // USER ERROR
  var rec = xmlDoc.selectSingleNode('error');
  if ( rec ) {
    error=rec.text;
    setState('error');
    setStatus(error);
    alert("Your changes could not be saved.\n\n" + stripHTML(error));
    return false;
  }
  // NORMAL COMPLETION
  // form
  xmlToChildIDs(xmlDoc,'records/record',oForm);
  // html
  xmlToChildIDs(xmlDoc,'records/html',oForm.document);
  
  if ( type == 'update' || type== 'add' ||  type== 'delete' || type=='qry') {
    setState('current');
  }
  
  // Info
  var rec = xmlDoc.selectSingleNode('records/info');
  if ( rec ) {
    setStatus(rec.text);
  }
  // Alert
  var rec = xmlDoc.selectSingleNode('records/alert');
  if ( rec ) {
    alert(rec.text);
  }
  // Nav
  if ( oForm.recordsLength && oForm.recordNumber) {
    var recordsLength =  oForm.recordsLength.value;
    var recordNumber = oForm.recordNumber.value;
    if ( recordNumber==1 ) {
      oForm.nav_first.disabled=true;
      oForm.nav_prev.disabled=true;
    } else {
      oForm.nav_first.disabled=false;
      oForm.nav_prev.disabled=false;
    }
    if ( recordNumber==recordsLength ) {
      oForm.nav_last.disabled=true;
      oForm.nav_next.disabled=true;
    } else {
      oForm.nav_last.disabled=false;
      oForm.nav_next.disabled=false;
    }
    if ( recordNumber==0 ) {
      // New Record
      dbFormData.formType='add';
      oForm.nav_new.disabled=true;
      oForm.nav_prev.disabled=true;
      oForm.nav_next.disabled=true;
      oForm.nav_del.disabled=true;
    } else {
       dbFormData.formType='update';
       if ( dbFormData.addURL ) {
	 oForm.nav_new.disabled=false;
       } else {
	 oForm.nav_new.disabled=true;
       }
       if ( dbFormData.deleteURL ) {
	 oForm.nav_del.disabled=false;
       } else {
	 oForm.nav_del.disabled=true;
       }
    }
    document.getElementById('recordIndicator').innerHTML=recordNumber + ' of ' + recordsLength;
    oForm.navTo.value='HERE';
  }
  // Event onFormActionReturn
  if ( oForm.onFormActionReturn != undefined ) {
    oForm.onFormActionReturn(action);
  }
}

// Status Message
function setStatus(msg) {
  if ( oDivStatus != undefined ) {
      $(oDivStatus).html(msg);
  }
}

function formEncode(form) {
  var list = new Array;
  for(var i=0;i<elmts.length;i++) {
    var value = new String;
    var elmt = elmts[i];
    var name = elmt.name;
    if (name == "") { continue }
    if (elmt.type == "checkbox" && elmt.boolean!="true" && !elmt.checked) { continue }
    if (elmt.type == "radio" && !elmt.checked) { continue }
    if (elmt.tagName=="DIV" && elmt.className=='clsRadioGroup') {
      // The value is found under INPUT's of type radio
      continue;
    }
  out: {
      if (elmt.tagName=="INPUT") {
	if ( elmt.type == "checkbox" ) {
	  if ( elmt.boolean ) {
	    value = getBoolboxValue(elmt);
	  } else {
	    value = getCheckboxValue(elmt);
	  }
	  break out;
	} 	
	value = elmt.value
	  break out;
      }
      if ( elmt.tagName == "TEXTAREA") {
	value = elmt.value
	  break out;
      }
      if (elmt.tagName=="SELECT") {
	value = getOptionValue(elmt)
	  break out;
      }
      
      // Default
      value = elmt.innerHTML;
    }
    list.push(encodeURIComponent(name) + "=" + encodeURIComponent(value));
  }
  return list.join("&");
}

//
}
