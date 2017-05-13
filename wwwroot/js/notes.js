function addNotes() {
    $.jAlert({
        'title': '添加游记',
        'content': '<form action="">' +
        '<label for="title">标题：</label>' +
        '<input type="text" class="form-control" id="title" name="title" placeholder="请输入标题." required>' +
        '<label for="content">内容：</label>' +
        '<textarea class="form-control" rows="5" name="content" id="content" required placeholder="请输入内容."></textarea>' +
        '</form><br>',
        'theme': 'blue',
        'onOpen': function (alert) {
            alert.find('form').on('submit', function (e) {
                e.preventDefault();
            });
        },
        'size': 'md',
        'btns': [
            {
                'text': '提交',
                'theme': 'green',
                'closeAlert': false,
                'onClick': function (e) {
                    e.preventDefault();
                    var btn = $('#' + this.id),
                        alert = btn.parents('.jAlert'),
                        form = alert.find('form'),
                        title = form.find('input[name="title"]').val(),
                        content = form.find('textarea[name="content"]').val();
                    /* Verify required fields, validate data */
                    if (typeof title == 'undefined' || title == '') {
                        $.jAlert({
                            'content': '请输入标题!'
                        })
                        return;
                    }
                    if (typeof content == 'undefined' || content == '') {
                        $.jAlert({
                            'content': '请输入内容!'
                        })
                        return;
                    }
                    var data = form.serialize()
                    $.post("/notes/add/" + $('.js_add').data('scenery') + "/" + $('.js_add').data('user'), data, function (res) {
                        if (res.code == 'success') {
                            alert.closeAlert();
                            $.jAlert({
                                'content': res.message
                            })
                        } else {
                            $.jAlert({
                                'content': res.message
                            })
                        }
                    })
                    return false;
                }
            }
        ]
    });
    return false;
}

