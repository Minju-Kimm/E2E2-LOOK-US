package org.example.follow.controller;

import org.example.exception.common.ApiErrorCategory;
import org.example.exception.user.ApiUserErrorSubCategory;
import org.example.exception.user.ApiUserException;
import org.example.follow.domain.dto.FollowDto;
import org.example.follow.domain.enums.FollowStatus;
import org.example.follow.service.FollowService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/me/follow")
public class FollowApiController {

	private final FollowService followService;

	/**
	 * 팔로우, 언팔로우
	 */
	@PutMapping("")
	public ResponseEntity<?> handleFollow(
		@RequestBody FollowDto.FollowRequest requestDto
	) {
		String fromUser = SecurityContextHolder.getContext().getAuthentication().getName();
		String toUser = requestDto.nickname();

		switch (requestDto.followStatus()) {
			case FOLLOW -> followService.follow(fromUser, toUser);
			case UNFOLLOW -> followService.unFollow(fromUser, toUser);
			default ->
				throw ApiUserException
					.builder()
					.category(ApiErrorCategory.RESOURCE_BAD_REQUEST)
					.subCategory(ApiUserErrorSubCategory.USER_FOLLOW_INVALID_REQUEST)
					.setErrorData(() -> String.format("follow status = %s", requestDto.followStatus()))
					.build();
		}

		return ResponseEntity.ok().build();
	}

	/**
	 * 현재 상대와 나의 팔로우 상태 가져오기
	 */
	@GetMapping("/status")
	public ResponseEntity<FollowDto.FollowStatusResponse> getFollowStatus(@RequestBody FollowDto.FollowStatusRequest requestDto) {
		String fromUser = SecurityContextHolder.getContext().getAuthentication().getName();
		String toUser = requestDto.nickname();

		FollowStatus followStatus = followService.getFollowStatus(fromUser, toUser);

		// followStatus에 따라 응답을 구성
		String followStatusResponse = followStatus == FollowStatus.FOLLOW ? "following" : "unfollowing";

		return ResponseEntity.ok(new FollowDto.FollowStatusResponse(followStatusResponse));
	}


}
