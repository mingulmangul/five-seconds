const player = document.querySelector(".video__player");
const form = document.getElementById("commentForm");
const deleteSpans = document.querySelectorAll(".comment__deleteBtn");

const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.className = "comment";
  newComment.setAttribute("id", id);
  const commentText = document.createElement("div");
  commentText.className = "comment__text";
  const commentIcon = document.createElement("i");
  commentIcon.className = "fas fa-comment";
  const textSpan = document.createElement("span");
  textSpan.innerText = ` ${text}`;
  const dataDiv = document.createElement("div");
  dataDiv.className = "comment__data";
  const div1 = document.createElement("div");
  const ownerSpan = document.createElement("span");
  ownerSpan.className = "comment__owner";
  ownerSpan.innerText = player.dataset.username;
  const timeSpan = document.createElement("span");
  timeSpan.className = "comment__created-at";
  timeSpan.innerText = " " + new Date().toString().substr(4, 11);
  const div2 = document.createElement("div");
  const deleteSpanIcon = document.createElement("i");
  deleteSpanIcon.className = "fas fa-trash-alt";
  deleteSpanIcon.setAttribute("data-id", id);
  const deleteSpan = document.createElement("span");
  deleteSpan.className = "comment__deleteBtn";
  deleteSpan.addEventListener("click", handleDeleteBtn);

  deleteSpan.appendChild(deleteSpanIcon);
  commentText.appendChild(commentIcon);
  commentText.appendChild(textSpan);
  div1.appendChild(ownerSpan);
  div1.appendChild(timeSpan);
  div2.appendChild(deleteSpan);
  newComment.appendChild(commentText);
  dataDiv.appendChild(div1);
  dataDiv.appendChild(div2);
  newComment.appendChild(dataDiv);
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
}
deleteSpans.forEach((deleteSpan) => {
  deleteSpan.addEventListener("click", handleDeleteBtn);
});
