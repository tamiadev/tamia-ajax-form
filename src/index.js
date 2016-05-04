// Ajax form

import reqwest from 'reqwest';
import serialize from 'form-serialize';
import { isElement } from 'lodash';
import { onEvent, addState, removeState } from 'tamia';
import { toggleSubmit } from 'tamia/lib/modules/form';

/**
 * Makes a form submittable via Ajax.
 *
 * @param {HTMLElement} form Form element.
 * @param {string} url Form action URL.
 * @param {string} [method=post] Method.
 * @param {string} [type=json] Data type.
 * @param {Function} [onBeforeSend] Before send callback (return false to cancel sending).
 * @param {Function} [onSuccess] Success callback.
 * @param {Function} [onError] Error callback.
 */
export default function ajaxForm({
	form,
	url,
	method = 'post',
	type = 'json',
	jsonpCallback,
	onBeforeSend = () => true,
	onSuccess = () => ({ result: 'success' }),
	onError = () => ({ result: 'error' }),
}) {
	if (DEBUG && !isElement(form)) {
		throw Error('ajaxForm: "form" is not an HTMLElement.');
	}
	if (DEBUG && !url) {
		throw Error('ajaxForm: "url" is undefined.');
	}

	let defaultMessage;
	let successElem = form.querySelector('.js-ajaxform-success');
	if (successElem) {
		defaultMessage = successElem.innerHTML;
	}

	let defaultError;
	let errorElem = form.querySelector('.js-ajaxform-error');
	if (errorElem) {
		defaultError = errorElem.innerHTML;
	}

	onEvent(form, 'submit', submit);

	function submit(event) {
		event.preventDefault();

		let data = serialize(form);
		if (!onBeforeSend(data)) {
			return;
		}

		removeState(form, 'success');
		removeState(form, 'error');
		addState(form, 'sending');
		toggleSubmit(form, false);

		reqwest({
			url,
			method,
			data,
			type,
			jsonpCallback,
			success,
			error,
		});
	}

	function success(data = {}) {
		let result = onSuccess(data);
		if (result.result === 'success') {
			done('success');
			if (successElem) {
				successElem.innerHTML = result.message || defaultMessage;
			}
			form.reset();
		}
		else {
			error(data);
		}
	}

	function error(data = {}) {
		done('error');
		let result = onError(data);
		if (errorElem) {
			errorElem.innerHTML = result.message || defaultError;
		}
	}

	function done(state) {
		addState(form, state);
		removeState(form, 'sending');
		toggleSubmit(form, true);
	}
}
