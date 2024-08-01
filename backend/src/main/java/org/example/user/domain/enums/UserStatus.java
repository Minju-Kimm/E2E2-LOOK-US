package org.example.user.domain.enums;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public enum UserStatus {
	USER_STATUS_SIGNED_IN("SIGNIN"), USER_STATUS_SIGNED_OUT("SIGNOUT");
	private String userStatusType;

	UserStatus(String userSign) {
		this.userStatusType = userSign;
	}
}