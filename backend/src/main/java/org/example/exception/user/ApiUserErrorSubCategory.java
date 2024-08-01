package org.example.exception.user;

public enum ApiUserErrorSubCategory {

	USER_NOT_FOUND("존재하지 않는 사용자입니다."),

	USER_ALREADY_EXISTS("이미 존재하는 사용자입니다."),

	USER_ALREADY_LOGGED_IN("이미 로그인한 사용자입니다."),
	;

	private final String userApiErrorSubCategory;

	ApiUserErrorSubCategory(String userApiErrorSubCategory) {
		this.userApiErrorSubCategory = userApiErrorSubCategory;
	}

	@Override
	public String toString() {
		return String.format("[원인: %s]", this.userApiErrorSubCategory);
	}
}