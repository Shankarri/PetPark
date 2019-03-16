$(document).ready(function () {
    //=============================================gloabal variables=============================================
    //Img src variavle
    var selectedPetSrc = ""
    //Messages for modal
    var messages = {
        goodStatus: [
            "Anything fun to do today? :) ",
            "Pur, Pur, Pur.... ꒰๑´•.̫ • `๑꒱ ",
            "It's a good day for a walk!(◕‿◕✿) ",
            "I think I'm quite handsome today, right? .。`ﾟヽ(｡◕‿◕｡)ﾉﾟ.:｡+ﾟ ",
            "(`･ω･´)ゞ Hi, Hi!!",
            "(੭ु ‾̑ω‾̑)੭ु Give me a hug!! ",
            "RUN RUN RUN ─=≡Σ((( つ•̀ω•́)つ !! ",
            "ヽ(○´∀`)ﾉ♪ Soooooo happy~~! Let's play! ",
            "(๑¯ิε ¯ิ๑)  Love you sooo much ~! ",
            "(•‾̑⌣‾̑•)✧˖° You look good today! "
        ],
        hungry2: "I need a snack（¯﹃¯）",
        hungry1: "I'm Hungry!! :( ",
        hungry0: "I'M STARVING!! I'd like a big chocolate brownie! ",
        sleepy2: "?(￣△￣?)...",
        sleepy1: "I'm very tired. ٩(๑´0`๑)۶ ",
        sleepy0: "Exhausted....I can't open my eyes...zzZ ",
        happy2: "(ਛ_≻ਛ) Em....",
        happy1: "Play with me!!! （/TДT)/ ",
        happy0: "Leave me alone! I don't wanna see your face!! (/= _ =)/~┴┴ ",
        hp2: "I'm not feeling well (,,•́ . •̀,,) ",
        hp1: "I'm dying. Send me to the vet ASAP... ",
        play: "Playing ╭(●｀∀´●)╯╰(●’◡’●)╮ ... ",
        sleep: "(-.-)..zzZZ ",
        feed: "Yum, yum, yum....ԅ(¯﹃¯ԅ) ",
        die: "You didn't love me, so I am dead. QAQ"
    }




    //=============================================Clickhandlers=============================================
    ////////////Log In & Sign Up & Log Outt=======================================

    // clickhandler for showing the log-in modal
    $("#loginModalBtn").on("click", function () {
        //show the modal
        $("#loginModal").modal("show")
        // stop the auto reload
        clearInterval(reloadUpdate)
    })

    // clickhandler for showing the sign-up modal
    $("#signinModalBtn").on("click", function () {
        //show the modal
        $("#signupModal").modal("show")
        // stop the auto reload
        clearInterval(reloadUpdate)
    })

    //clickhandler for log-in btn
    $("#loginBtn").on("click", function (e) {
        e.preventDefault()
        let name = $.trim($("#lg_username").val())
        console.log("username is :" + name)
        let password = $("#lg_password").val()
        var reqestbody = {
            name: name,
            password: password
        }
        if (name === "" || password === "") {
            alert("Please enter a valid username and password!")
        } else {
            // token POST request
            $.ajax({
                url: "/token",
                data: reqestbody,
                method: "POST"
            }).then(function (response) {
                if (response === "noUser") {
                    // warning alerts for user does not exist
                    alert("User does not exist. Please sign up first!")

                } else if (response === "passwordWrong") {
                    // warning alerts for password wrong
                    alert("The username or password you entered is incorrect. Please try again or sign up!")

                } else {
                    // pass the validation!
                    console.log("Got Data:", response);
                    // call the function to attach token in ajex request
                    attachToken(response.token);
                    // alert user welcome
                    alert("Welcome, " + response.user.name + "!")
                    // call the checktoken function and close the modal
                    checkToken()
                    $('#loginModal').modal('toggle')
                    //reload the page to start the auto reload
                    location.reload()
                }
            })

        }
    })

    //clickhandlers for sign up btn
    $("#signupBtn").on("click", function (e) {
        e.preventDefault()
        let name = $.trim($("#su_username").val())
        console.log("username is :" + name)
        let password = $("#su_password").val()
        var reqestbody = {
            name: name,
            password: password
        }
        // input validation
        if (name === "" || password === "") {
            // check if there is name and password input
            alert("Please enter a valid username and password!")
        } else {
            // check if user already exists
            $.ajax({
                url: "/api/user/" + name,
                type: 'GET',
                // data: reqestbody,
            }).then(function (data) {
                console.log(data)
                // if did not exist
                if (data === null) {
                    //POST: new user
                    $.ajax({
                        url: "/api/newuser",
                        type: 'POST',
                        data: reqestbody,
                    }).then(function (result) {
                        console.log("Add a new user!")
                        // log in the user
                        // token POST request
                        $.ajax({
                            url: "/token",
                            data: reqestbody,
                            method: "POST"
                        })
                            .then(function (response) {
                                console.log("Got Data:", response);
                                // call the function to attach token in ajex request
                                attachToken(response.token);
                                // testTokenAttached();
                                alert("Welcome, " + response.user.name + "!")
                                // call the checktoken function
                                checkToken()
                                $('#signupModal').modal('toggle')
                                //reload the page to start the auto reload
                                location.reload()
                            })
                    })


                    // if exists
                } else {
                    alert("User already exists! Please use another name!")
                }
            })
        }
    })

    // clickhandler for sign out btn
    $("#logoutBtn").on("click", function (e) {
        localStorage.removeItem("token")
        // call the checktoken function
        checkToken()
        attachToken()
    })

    ////////////==================================================





    ////////////create pet========================================
    //clickhandler for showing the create pet modal
    $("#createPet").on("click", function (e) {
        e.preventDefault()
        // run the function that displays pet options
        creatNewPetList()
        // show the modal
        $('#createPetModal').modal('show')
        // stop the autoreload
        clearInterval(reloadUpdate)
    })

    //clickhandler for select a pet
    $("#createPetModal").on("click", ".selectPetBox", function (e) {
        e.preventDefault()
        console.log("click!")
        // change the border color and thickness of the selected box
        $(".selectPetBox").removeClass("selectedPetBox")
        $(this).addClass("selectedPetBox");
        selectedPetSrc = $(this).data("img");
        console.log(selectedPetSrc)
        // get the name of the pet
    })

    //clickhandler for submit/create a pet
    $("#createNewPetBtn").on("click", function (e) {
        e.preventDefault()
        let name = $("#newPetName").val()
        let img = selectedPetSrc
        let requestBody = {
            name: name,
            img: img,
        }
        if (localStorage.getItem("token") === null) {
            $("#errorSelectPet").html("<div>Please <a href='' data-toggle='modal' data-target='#signupModal'>sign up</a> or <a href='' data-toggle='modal' data-target='#loginModal'>log in</a> first!</div>")
        } else {
            if (img == "") {
                console.log("Need to select a pet")
                $("#errorSelectPet").html("Please select a pet!")
            }
            else if (name == "") {
                console.log("Need to select a name")
                $("#errorSelectPet").html("Please name your pet!")
            }
            // hit the POST request path
            else {
                $.ajax({
                    url: "/api/newpet",
                    type: 'POST',
                    data: requestBody,
                }).then(function (result) {
                    console.log("New Pet has been created")
                    location.reload()
                })
            }
        }
    })
    ////////////===================================================






    ////////////show info=================================================
    //clickhandlers for pets in the park for showing info
    $("article").on("click", function (e) {
        e.preventDefault();
        console.log("click")
        // get the id from article data-id
        var id = $(this).data("id");
        console.log("Show the info of pet id: " + id)
        // update the progress bar
        showPetInfo(id);
        // update the message:
        messageGenerator.showStatusMessage(id);
    })
    ////////////===========================================================




    ////////////actions====================================================
    //clickhandlers for actions
    $(".action").on("click", function (e) {
        e.preventDefault()
        let id = $(this).data("id");
        let action = $(this).text()
        console.log("Do " + action + " to the pet id " + id)
        let requestBody = {
            action: action
        }
        console.log("PUT requst.body is")
        console.log(requestBody)
        // PUT: change specific data of specific pet
        $.ajax({
            url: "/api/pets/" + id,
            type: 'PUT',
            data: requestBody,
        }).then(function (result) {
            console.log("changes made!");
            if (action === "Kill") {
                location.reload()
            } else {
                // update the progress bar
                showPetInfo(id);
                // update the message:
                messageGenerator.showActionMessage(action);
            }
        })

    })

    // click handler for resurrecting the pet
    $("#resurrectBtn").on("click", function (e) {
        e.preventDefault()
        console.log("click")
        // hide the modal
        $('#petStatus').modal('hide')
        var id = $(this).data("id")
        // show the thunder
        let thunderImg = `<div><img src="/assets/img/thunder.gif" id="thunder"  style="width:80%"></div>`
        $(".grave[data-id=" + id + "]").append(thunderImg)
        //remove the thunder and reload the dom to show the resurrected pet
        setTimeout(function () {
            $('#thunder').remove()
            // a PUT request to change the pet back to alive
            let requestBody = {
                action: "Resurrect"
            }
            console.log(requestBody)
            // PUT: change specific data of specific pet
            $.ajax({
                url: "/api/pets/" + id,
                type: 'PUT',
                data: requestBody,
            }).then(function (result) {
                console.log("The pet is resurrected!");
                location.reload()
            })
        }, 1200)
    })

    // clickhandler for hard kill the pet
    $("#hardKillBtn").on("click", function (e) {
        e.preventDefault()
        if (localStorage.getItem("token") === null) {
            alert("You need to log in to hard kill a pet!")
        } else {
            var id = $(this).data("id")
            // DELETE: remove a pet from the database
            $.ajax({
                url: "/api/pet/" + id,
                type: 'DELETE',
            }).then(function (result) {
                if (result === "notOwner") {
                    alert("Sorry, you're not the owner!")
                } else {
                    // hide the modal
                    $('#petStatus').modal('hide')
                    // show the boom and remove it and reload
                    let boomImg = `<div><img src="/assets/img/boom.png" id="boom"></div>`
                    $(".grave[data-id=" + id + "]").append(boomImg)
                    setTimeout(function () {
                        $('#boom').remove()
                        location.reload()
                    }, 800)
                }
            })
        }
    })
    ////////////===========================================================









    //=============================================Functions=============================================


    ////////////prepare for create pet===========================================
    // a function that displays pet options
    const creatNewPetList = function () {
        // run the src of gifs in a for loop
        for (let i = 0; i < 20; i++) {
            let src = "/assets/img/gif/pet" + i + ".gif"
            let articleDiv = '<div class="selectPetBox p-2" style="align-items: center" data-img="' + src + '"><div style="align-self: center; justify-self: center;"><img src="' + src + '"></div></div>'
            // append to div cards-createNewPet
            $(".cards-createNewPet").append(articleDiv)
        }
    }
    ////////////================================================================



    ////////////prepare for show info===========================================
    // function to show/update info of specific pet
    const showPetInfo = function (id, cb) {
        // GET: specific pet info
        $.ajax({
            url: "/api/pet/" + id,
            method: "GET"
        }).then(function (data) {
            // convert into percentage
            var name = data.name
            var username = data.User.name
            var alive = data.alive
            var hp = parseInt(data.hp) * (100 / 3)
            var hungry = parseInt(data.hungry) * 20
            var sleepy = parseInt(data.sleepy) * 20
            var happy = parseInt(data.happy) * 20
            // change the texts and progress bars
            $(".petInfo-title").html("<b>" + name + "</b> | Owner: " + username)
            //if it is alive
            //show and update the info
            if (alive) {
                $("#resurrectInfo").css("display", "none")
                $("#aliveInfo").css("display", "block")
                //change the progress bars
                $("#hpBar").attr("style", "width:" + hp + "%")
                $("#hungryBar").attr("style", "width:" + hungry + "%")
                $("#sleepyBar").attr("style", "width:" + sleepy + "%")
                $("#happyBar").attr("style", "width:" + happy + "%")

                //change the action btns' data-id
                $("#killBtn").attr("data-id", id)
                $("#feedBtn").attr("data-id", id)
                $("#sleepBtn").attr("data-id", id)
                $("#playBtn").attr("data-id", id)

            } else {
                //if it is not alive show the resurrect and hard kill btns
                $("#aliveInfo").css("display", "none")
                $("#resurrectInfo").css("display", "block")
                //change the data id of the resurrect button
                console.log("The resurrect btn id is " + id)
                $("#resurrectBtn").attr("data-id", id)
                $("#hardKillBtn").attr("data-id", id)
            }
            // show the pet info modal
            $('#petStatus').modal('show')
        })
    }

    // functions to manage messages in the modal
    const messageGenerator = {
        // a function that generate the message of status in the info modal
        statusMessage: function (alive, hp, hungry, sleepy, happy) {
            var message = ''
            if (alive) {
                if (hp === 1) {
                    message = message.concat(messages.hp1)
                } else if (hp === 2) {
                    message = message.concat(messages.hp2)
                }
                if (hungry === 0) {
                    message = message.concat(messages.hungry0)
                }
                if (hungry === 1) {
                    message = message.concat(messages.hungry1)
                }
                if (hungry === 2) {
                    message = message.concat(messages.hungry2)
                }
                if (sleepy === 0) {
                    message = message.concat(messages.sleepy0)
                }
                if (sleepy === 1) {
                    message = message.concat(messages.sleepy1)
                }
                if (sleepy === 2) {
                    message = message.concat(messages.sleepy2)
                }
                if (happy === 0) {
                    message = message.concat(messages.happy0)
                }
                if (happy === 1) {
                    message = message.concat(messages.happy1)
                }
                if (happy === 2) {
                    message = message.concat(messages.happy2)
                }
                if (happy > 2 && sleepy > 2 && hungry > 2) {
                    let random = Math.floor(Math.random() * messages.goodStatus.length)
                    message = message.concat(messages.goodStatus[random])
                }
            } else {
                message = message.concat(messages.die)
            }
            return message
        },
        // a function that generate the message of actions in the info modal
        actionMessage: function (action) {
            let message = ''
            // if for different actions
            if (action === "Feed") {
                message = messages.feed
            }
            if (action === "Sleep") {
                message = messages.sleep
            }
            if (action === "Play") {
                message = messages.play
            }
            return message
        },
        // a function that show the message of status in the info modal
        showStatusMessage: function (id) {
            // GET: specific pet info
            $.get("/api/pet/" + id, function (data) {
                // convert into percentage
                var alive = data.alive
                var hp = parseInt(data.hp)
                var hungry = parseInt(data.hungry)
                var sleepy = parseInt(data.sleepy)
                var happy = parseInt(data.happy)
                // generate the message:
                let message = messageGenerator.statusMessage(alive, hp, hungry, sleepy, happy)
                $("#message").html(message)
            })
        },
        // a function that show the message of actions in the info modal
        showActionMessage: function (action) {
            let message = messageGenerator.actionMessage(action)
            $("#message").html(message)
        }

    }


    //////////// reload page & database================================================================
    // a function to update databse everytime one reloads the page
    function reloadUpdate() {
        $.ajax({
            url: "/api/p/",
            type: 'PUT',
        }).then(function (result) {
            console.log("changes made!");
            location.reload()
            console.log("page reload")
        })
    };

    // reload the page every 1 minutes
    setInterval(reloadUpdate, 60000)
    ////////////=======================================================================================

})



//////////// Authentication========================================================================
// a token attached every time make a request
function attachToken(token) {
    if (token) {
        // save the token in localstorage
        localStorage.setItem("token", token)
    }

    //the attachToken function adds the token to EVERY ajax request
    $.ajaxSetup({
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        }
    });
}
////////////=======================================================================================




//////////// manage btns on the page================================================================
// a function that check if there is a token in localstorage
// if is display log-out btn
// if not display log-in and sign-up btns
function checkToken() {
    console.log(localStorage.getItem("token"))
    if (localStorage.getItem("token") === null) {
        $("#logoutBtn").css("display", "none")
        $("#loginModalBtn").attr("style", "display:inline!important")
        $("#signinModalBtn").attr("style", "display:inline!important")
    } else {
        $("#logoutBtn").css("display", "inline")
        $("#loginModalBtn").attr("style", "display:none!important")
        $("#signinModalBtn").attr("style", "display:none!important")
    }
}
////////////=======================================================================================




//=============================================Calling some functions=============================================
// call the checktoken/ attachToken/ update Database function everytime the page reloads
checkToken()
attachToken()
console.log("page reload!")

