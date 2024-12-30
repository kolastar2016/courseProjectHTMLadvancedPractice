/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
 // Подключаем SCSS файл
document.addEventListener('DOMContentLoaded', () => {
  loadUsersAndComments();
  document.getElementById('show-all-comments').addEventListener('click', showAllComments);
  document.getElementById('filter-favorites').addEventListener('click', filterFavorites);
  document.getElementById('comments-container').addEventListener('click', event => {
    if (event.target.classList.contains('heart-button')) {
      toggleHeart(event.target);
    }
  });
});
let allCommentsByUser = {};
let favorites = {};
function loadUsersAndComments() {
  favorites = JSON.parse(localStorage.getItem('favorites')) || {};
  fetch('https://jsonplaceholder.typicode.com/users').then(response => response.json()).then(users => {
    return fetch('https://jsonplaceholder.typicode.com/comments').then(response => response.json()).then(comments => {
      allCommentsByUser = groupCommentsByUser(comments);
      users.forEach(user => renderCommentsForUser(user));
    });
  }).catch(error => console.error('Error loading users or comments:', error));
}
function groupCommentsByUser(comments) {
  return comments.reduce((acc, comment) => {
    if (!acc[comment.postId]) {
      acc[comment.postId] = [];
    }
    acc[comment.postId].push(comment);
    return acc;
  }, {});
}
function renderCommentsForUser(user) {
  const commentsContainer = document.getElementById('comments-container');
  const userElement = document.createElement('div');
  userElement.classList.add('user-block');
  userElement.innerHTML = `<h3>${user.name}</h3>`;
  const userComments = allCommentsByUser[user.id]?.slice(0, 5) || [];
  userComments.forEach(comment => {
    const commentElement = document.createElement('div');
    commentElement.classList.add('comment');
    commentElement.dataset.id = comment.id;
    const isLiked = favorites[comment.id] || false;
    commentElement.innerHTML = `
            <p><strong>${comment.name}:</strong> ${comment.body}</p>
            <button class="heart-button ${isLiked ? 'liked' : ''}">❤</button>
        `;
    userElement.appendChild(commentElement);
  });
  commentsContainer.appendChild(userElement);
}
function toggleHeart(element) {
  element.classList.toggle('liked');
  const commentElement = element.closest('.comment');
  const commentId = commentElement.dataset.id;
  if (element.classList.contains('liked')) {
    favorites[commentId] = true;
  } else {
    delete favorites[commentId];
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
}
function showAllComments() {
  document.querySelectorAll('.user-block').forEach(userBlock => {
    userBlock.classList.remove('hidden');
    userBlock.querySelectorAll('.comment').forEach(comment => {
      comment.classList.remove('hidden');
    });
  });
  document.getElementById('no-favorites-message').classList.add('hidden');
}
function filterFavorites() {
  let hasFavorites = false;
  document.querySelectorAll('.user-block').forEach(userBlock => {
    let hasUserFavorites = false;
    userBlock.querySelectorAll('.comment').forEach(comment => {
      const heartButton = comment.querySelector('.heart-button');
      if (heartButton.classList.contains('liked')) {
        comment.classList.remove('hidden');
        hasFavorites = true;
        hasUserFavorites = true;
      } else {
        comment.classList.add('hidden');
      }
    });
    if (!hasUserFavorites) {
      userBlock.classList.add('hidden');
    } else {
      userBlock.classList.remove('hidden');
    }
  });
  const noFavoritesMessage = document.getElementById('no-favorites-message');
  noFavoritesMessage.classList.toggle('hidden', hasFavorites);
}
/******/ })()
;