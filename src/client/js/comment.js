const videoPlayer = document.querySelector(".video__player");
const form = document.getElementById("commentForm");

const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.className = "comment";
  newComment.dataset.id = id;
  const commentText = document.createElement("div");
  commentText.className = "comment__text";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const textSpan = document.createElement("span");
  textSpan.innerText = ` ${text}`;
  const ownerSpan = document.createElement("span");
  ownerSpan.className = "comment__owner";
  ownerSpan.innerText = videoPlayer.dataset.username;
  const timeSpan = document.createElement("span");
  timeSpan.className = "comment__created-at";
  timeSpan.innerText = " " + new Date().toString().substr(4, 11);
  const deleteSpan = document.createElement("span");
  deleteSpan.innerText = " ❌";

  commentText.appendChild(icon);
  commentText.appendChild(textSpan);
  newComment.appendChild(commentText);
  newComment.appendChild(ownerSpan);
  newComment.appendChild(timeSpan);
  newComment.appendChild(deleteSpan);
  videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoPlayer.dataset.id;
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

if (form) {
  form.addEventListener("submit", handleSubmit);
}
