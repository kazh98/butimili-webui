import { action, observable } from "mobx";
import stores from ".";

export enum State {
	IDLE,
	RUNNING,
	DONE,
	ERROR,
}

export enum Mode {
	NONE,
	GET,
	SEARCH,
	CREATE,
	UPDATE,
	DELETE,
	ACTIVATE,
	LOGIN,
	LOGOUT,
	IMPORT,
}

export interface IApiBase<T> {
	error: number;
	data: T;
}

export class StoreBase {
	constructor() {
		this.state = State.IDLE;
		this.mode = Mode.NONE;
	}

	@observable
	public state: State;

	@observable
	public mode: Mode;

	@action.bound
	public setState(state: State) {
		this.state = state;
	}

	@action.bound
	public resetState() {
		this.state = State.IDLE;
	}

	@action.bound
	public setMode(mode: Mode) {
		this.mode = mode;
	}

	@action.bound
	public resetMode() {
		this.mode = Mode.NONE;
	}

	protected generateFetchHeader(withAuth: boolean = true, override?: any) {
		const baseHeader = {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"If-Modified-Since": "Thu, 01 Jun 1970 00:00:00 GMT",
		};
		const result = Object.assign({}, baseHeader);
		if (withAuth) {
			Object.assign(result, {
				Authorization: `Bearer ${localStorage.accessToken}`,
			});
		}
		if (override) {
			Object.assign(result, override);
		}

		return result;
	}

	protected logoutIfInvalidSession(response: IApiBase<{}>) {
		if (response.error !== 0) {
			stores.AuthStore.logout();
		}
	}

	protected get userName() {
		return stores.AuthStore.userInfo.username;
	}

	protected tryShowToast(message?: string) {
		try {
			stores.ToastStore.showToast(message);
		} catch (e) {}
	}

	protected get apiBasePath() {
		return process.env.BASE_URL;
	}
}
