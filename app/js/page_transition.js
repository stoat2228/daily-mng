const btnmove=document.getElementById("btn");

btnmove.addEventListener('click', function () {
    today=new Date()

    var toTwoDigits = function (num, digit) {
        num += ''
        if (num.length < digit) {
            num = '0' + num
        }
        return num
    }

    var yyyy = toTwoDigits(today.getFullYear(), 4)
    var mm = toTwoDigits(today.getMonth()+1, 2)
    var dd = toTwoDigits(today.getDate(), 2)
    var parameter = yyyy + "-" + mm + "-" + dd;

    location.href = 'register.html?targetdate='+parameter
}, false);

