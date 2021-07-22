import axios from "axios";
import { store } from "../store/store";
// eslint-disable-next-line
var stripe = Stripe('pk_test_51HPidRDn6vXg5DP2OePFxbnul8Za9hWYBVdrvy7duRtr35t9OnYpEdUomQ0LKRB17P9h3nZgBNWnB0v0Y4bDVWjh00oECQ0a9i');
// var stripe = Stripe('pk_test_W6oXyYxcZJlFwUZlFN7UbBKy'); // our
const API_URL = "https://us-central1-cracking-ai.cloudfunctions.net/api";
// const API_URL = "http://localhost:5000/cracking-ai/us-central1/api";

export default {
	createCustomer(email) {
		const data = { email };
		const headers = {
			"Authorization": "Bearer " + store.state.curUser.idToken
		}
		return axios.post(`${API_URL}/stripe/create-customer`, data, { headers });
	},
	createSubscription(data) {
		const headers = {
			"Authorization": "Bearer " + store.state.curUser.idToken
		}
		return axios.post(`${API_URL}/stripe/create-subscription`, data, { headers });
	},
	cancelSubscription(data) {
		const headers = {
			"Authorization": "Bearer " + store.state.curUser.idToken
		}
		return axios.post(`${API_URL}/stripe/cancel-subscription`, data, { headers });
	},
	updateSubscription(data) {
		const headers = {
			"Authorization": "Bearer " + store.state.curUser.idToken
		}
		return axios.post(`${API_URL}/stripe/update-subscription`, data, { headers });
	},
	resumeSubscription(data) {
		const headers = {
			"Authorization": "Bearer " + store.state.curUser.idToken
		}
		return axios.post(`${API_URL}/stripe/resume-subscription`, data, { headers });
	},
	getStripe() {
		return stripe;
	},
	updateCard(data) {
		const headers = {
			"Authorization": "Bearer " + store.state.curUser.idToken
		}
		return axios.post(`${API_URL}/stripe/update-card`, data, { headers })
	},
	getCustomerTranscationList(customerId) {
		const headers = {
			"Authorization": "Bearer " + store.state.curUser.idToken
		}
		return axios.get(`${API_URL}/stripe/customer-transcation-list/${customerId}`, { headers });
	},
	createScheduleSubscription(data) {
		const headers = {
			"Authorization": "Bearer " + store.state.curUser.idToken
		}
		return axios.post(`${API_URL}/stripe/schedule-subscription`, data, { headers });
	},
	cancelScheduleSubscription(scheduleId) {
		const headers = {
			"Authorization": "Bearer " + store.state.curUser.idToken
		}
		return axios.delete(`${API_URL}/stripe/cancel-scheduled-subscription/${scheduleId}`, { headers });
	},
	sendEmail(data) {
		const headers = {
			"Authorization": "Bearer " + store.state.curUser.idToken
		}
		return axios.post(`${API_URL}/email/send-email`, data, { headers });	
	}
}