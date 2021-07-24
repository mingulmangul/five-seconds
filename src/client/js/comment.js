const player = document.querySelector(".video-player");
const form = document.getElementById("commentForm");
const textarea = form.querySelector("textarea");
const deleteButtons = document.querySelectorAll(".comment__delete i");

const addComment = (text, id) => {
  const videoComments = document.querySelector(".comments ul");
  const newComment = document.createElement("li");
  newComment.className = "comment";
  newComment.setAttribute("id", id);
  const commentInfo = document.createElement("div");
  commentInfo.className = "comment__info";
  const commentIcon = document.createElement("i");
  commentIcon.className = "fas fa-comment";
  const ownerSpan = document.createElement("span");
  ownerSpan.className = "comment__owner";
  ownerSpan.innerText = player.dataset.username;
  const timeSpan = document.createElement("span");
  timeSpan.innerText = new Date().toString().substr(4, 11);
  const deleteSpan = document.createElement("span");
  deleteSpan.className = "comment__delete";
  deleteSpan.setAttribute("data-id", id);
  deleteSpan.addEventListener("click", handleDeleteBtn);
  const deleteSpanIcon = document.createElement("i");
  deleteSpanIcon.className = "fas fa-trash-alt";
  const commentText = document.createElement("div");
  commentText.className = "comment__text";
  const comment = document.createElement("p");
  comment.innerText = text;

  newComment.appendChild(commentInfo);
  commentInfo.appendChild(commentIcon);
  commentInfo.appendChild(ownerSpan);
  commentInfo.appendChild(timeSpan);
  commentInfo.appendChild(deleteSpan);
  deleteSpan.appendChild(deleteSpanIcon);
  newComment.appendChild(commentText);
  commentText.appendChild(comment);
  videoComments.prepend(newComment);
};

const delComment = (id) => {
  const comment = document.getElementById(id);
  comment.parentNode.removeChild(comment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = player.dataset.id;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};

const handleInput = (event) => {
  const { target } = event;
  target.style.height = "1px";
  target.style.height = target.scrollHeight + "px";
};

const handleDeleteBtn = async (event) => {
  const videoId = player.dataset.id;
  const commentId = event.target.dataset.id;
  const response = await fetch(`/api/videos/${videoId}/comments/delete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ commentId }),
  });
  if (response.status === 201) {
    delComment(commentId);
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
  textarea.addEventListener("input", handleInput);
}
deleteButtons.forEach((deleteButton) => {
  deleteButton.addEventListener("click", handleDeleteBtn);
});
