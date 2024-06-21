let comments = [];
var socket = io.connect('/comment');
const urlParams = new URLSearchParams(window.location.search);
const 게시물_ID = urlParams.get('게시물_ID');

document.getElementById('postCommentButton').addEventListener('click', function () {
    const commentText = document.getElementById('textAreaExample').value;
    const commenterName = document.getElementById('commenterName').value;
    if (commentText.trim() !== '' && commenterName.trim() !== '') {
        const newComment = {
            text: commentText,
            date: new Date().toLocaleString(),
            name: commenterName
        };
        comments.push(newComment);
        document.getElementById('textAreaExample').value = '';
        displayComments();
        socket.emit('edit_comment', {'ID':게시물_ID,'comment':commentText});
        socket.emit('comment_num',게시물_ID);
    }
});

socket.on('question', function(data) {
    questionpage(data)
});

socket.on('comment_num', function(data) {
    console.log(data)
    const text4 = document.getElementById('text4');
    text4.value = data;

});

socket.on('comment', function(data) {
// 서버에서 보낸 데이터를 comments 배열에 추가
    console.log(data);
    jsond=JSON.parse(data);
    jsond.forEach(comment => {
        var n="";
        if (comment.선생이름){
            n=comment.선생이름;
        }
        else {
            n=comment.학생이름;
        };
        console.log("test");
        console.log(n);
        comments.push({
        id:comment.댓글_ID,
        name: n,
        text: comment.내용,
        date: comment.댓글시간
        });
    });
    
    // 댓글을 화면에 표시
    displayComments();
});


document.addEventListener('DOMContentLoaded', function() {
    socket.emit('question',게시물_ID);
    socket.emit('comment_num',게시물_ID);
    socket.emit('comment',게시물_ID);
});

function displayComments() {
    const commentsContainer = document.getElementById('commentsContainer');

    commentsContainer.innerHTML = comments.map((comment, index) => `
    <div class="card mb-3">
        <div class="card-body" id="comment-${comment.id}">
            <div class="d-flex flex-start">
                <img class="rounded-circle shadow-1-strong me-3"
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                    alt="avatar" width="40" height="40" />
                <div class="w-100">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h6 class="text-primary fw-bold mb-0">
                            ${comment.name}
                            <span class="text-body ms-2">${comment.text}</span>
                        </h6>
                        <p class="mb-0">${comment.date}</p>
                    </div>
                    <button class="btn btn-secondary btn-sm" onclick="editComment(${index})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteComment(${index})">Delete</button>
                </div>
            </div>
        </div>
    </div>
    `).join('');
}

function editComment(index) {
    const comment = comments[index];
    const newCommentText = prompt("Edit your comment:", comment.text);
    if (newCommentText !== null && newCommentText.trim() !== '') {
        comments[index].text = newCommentText;
        displayComments();
    }
}

function deleteComment(index) {
    comments.splice(index, 1);
    displayComments();
    socket.emit('delete_comment',댓글_ID)
    socket.emit('comment_num',게시물_ID);
}


function questionpage(data){
    const questionData = JSON.parse(data)[0];
    console.log(questionData);

    // DOM 요소 찾기
    const text1 = document.getElementById('text1');
    const text2 = document.getElementById('text2');
    const text3 = document.getElementById('text3');
    const text5 = document.getElementById('text5');
    // DOM 요소가 존재하는지 확인 후 값 설정
    if (text1) {
        text1.value = questionData.제목;
    }
    if (text2) {
        text2.value = questionData.user_name;
    }
    if (text3) {
        text3.value = questionData.작성시간;
    }
    if (text5) {
    text5.value = questionData.작성내용;
    }
}
