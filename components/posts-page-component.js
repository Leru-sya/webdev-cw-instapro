import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, getToken, renderApp } from "../index.js";
import { ru } from 'date-fns/locale'
import { formatDistance } from "date-fns/esm";
import { addLikePost, removeLikePost } from "../api.js";
import { replaceSave } from "../helpers.js";

export function renderPostsPageComponent({ appEl }) {
  
  console.log("Актуальный список постов:", posts);
  let emptyArray;
  if (posts.length) {
    const getApiPost = posts.map((postUser) => {
      return {
        postId: postUser.id,
        postImageUrl: postUser.imageUrl,
        postCreatedAt: formatDistance(new Date(postUser.createdAt), new Date, { locale: ru }),
        description: replaceSave(postUser.description),
        userId: postUser.user.id,
        userName: replaceSave(postUser.user.name),
        userLogin: postUser.user.login,
        postImageUserUrl: postUser.user.imageUrl,
        usersLikes: postUser.likes,
        isLiked: postUser.isLiked,
      }
    })
    emptyArray = getApiPost.map((postUser,index) => {
      return `
      <li class="post">
            <div class="post-header" data-user-id="${postUser.userId}">
                <img src="${postUser.postImageUserUrl}" class="post-header__user-image">
                <p class="post-header__user-name">${postUser.userName}</p>
            </div>
            <div class="post-image-container">
              <img class="post-image" data-post-id="${postUser.postId}" src="${postUser.postImageUrl}" data-index="${index}">
            </div>
            <div class="post-likes">
              <button data-post-id="${postUser.postId}" data-like="${postUser.isLiked ? 'true' : ''}" data-index="${index}" class="like-button">
                <img src=${
                  postUser.isLiked
                      ? './assets/images/like-active.svg'
                      : './assets/images/like-not-active.svg'
              }>
              </button>
              <p class="post-likes-text">
                Нравится: ${postUser.usersLikes.length > 0 ? `${postUser.usersLikes[postUser.usersLikes.length - 1].name} 
                      ${postUser.length - 1 > 0 ? 'и ещё ' + (postUser.userLikes.length - 1) : ''}` : '0'
        }
              </p>
            </div>
            <p class="post-text">
              <span class="user-name">${postUser.userName}</span>
              ${postUser.description}
            </p>
            <p class="post-date">
              ${postUser.postCreatedAt}
            </p>
          </li>`
    }).join("");
  } else {
    emptyArray = "Постов нет";
  }


  const mainPageHtml = ` <div class="page-container">
  <div class="header-container"></div>
  <ul class="posts">
  ${emptyArray}
  </ul>
</div>`



  appEl.innerHTML = mainPageHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }
  likeEventListener({ token: getToken() })
  likeEventListenerOnIMG({ token: getToken() })
}

export function likeEventListener() {
	const likeButtons = document.querySelectorAll('.like-button')

	likeButtons.forEach((likeButton) => {
		likeButton.addEventListener('click', (event) => {
			event.stopPropagation()
			const postId = likeButton.dataset.postId
			const index = likeButton.dataset.index
			

			if (posts[index].isLiked) {
				removeLikePost({ token: getToken(), postId })
					.then((updatedPost) => {
						posts[index].isLiked = false
            posts[index].likes = updatedPost.post.likes;
						renderApp();
					})
			} else {
				addLikePost({ token: getToken(), postId })
					.then((updatedPost) => {
						posts[index].isLiked = true
            posts[index].likes = updatedPost.post.likes;
						renderApp();
					})
			}
		})
	})
}

export function likeEventListenerOnIMG() {
	const likeButtons = document.querySelectorAll('.post-image')

	likeButtons.forEach((likeButton) => {
		likeButton.addEventListener('dblclick', (event) => {
			event.stopPropagation()
			const postId = likeButton.dataset.postId
			const index = likeButton.dataset.index

			if (posts[index].isLiked) {
				removeLikePost({ token: getToken(), postId })
					.then((updatedPost) => {
						posts[index].isLiked = false
            posts[index].likes = updatedPost.post.likes;
						renderApp();
					})
			} else {
				addLikePost({ token: getToken(), postId })
					.then((updatedPost) => {
						posts[index].isLiked = true
            posts[index].likes = updatedPost.post.likes;
						renderApp();
					})
			}
		})
	})
}
