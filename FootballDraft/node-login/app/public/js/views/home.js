
$(document).ready(function(){

	var hc = new HomeController();
	var pv = new PlayerValidator();
	// var pv = new AccountValidator();
	
	$('#player-form').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			// formData.push('user_id',$('#player_id-tf').val() )
			if (pv.validateForm() == false){
				return false;
			} 	else{
			// // push the disabled username field onto the form data array //
				// formData.push({name:'user', value:$('#user-tf').val()})
				formData.push({name:'user', value:$('#user-tf').val()})
				return true;
			}
		},
		success	: function(responseText, status, xhr, $form){
			if (status == 'success') hc.onUpdateSuccess();
		},
		error : function(e){
			if (e.responseText == 'email-taken'){
				pv.showInvalidEmail();
			}	else if (e.responseText == 'username-taken'){
				pv.showInvalidUserName();
			}
		}
	});
	$('#player-tf').focus();

// customize the account settings form //
	
	$('#account-form h2').text('$').css('display', 'inline'); 
	$('#bids').addClass('h1').text(0).css('display', 'inline');
	$('#timer').addClass('h1').text(12).css('float', 'right');
	// $('#account-form #bids').text(0);
	$('#user-tf').attr('disabled', 'disabled');
	$('#account-form-btn1').html('Delete');
	$('#account-form-btn1').addClass('btn-danger');
	$('#account-form-btn2').html('Update $');
	$('#account-form-btn3').html('Start Time');
	$('#account-form-btn4').html('Select Player');
	$('#addone').html('$1');
	$('#addfive').html('$5');
	$('#addten').html('$10');
	// $('#timer').text('30');

// setup the confirm window that displays when the user chooses to delete their account //

	$('.modal-confirm').modal({ show : false, keyboard : true, backdrop : true });
	$('.modal-confirm .modal-header h4').text('Delete Account');
	$('.modal-confirm .modal-body p').html('Are you sure you want to delete your account?');
	$('.modal-confirm .cancel').html('Cancel');
	$('.modal-confirm .submit').html('Delete');
	$('.modal-confirm .submit').addClass('btn-danger');

});