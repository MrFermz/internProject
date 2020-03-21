var PERM            = [0, 2, 3, 4]
var LISTS


async function onLoad() {
    let TYPE_FROM_SYS   = await sqlQueriesGET('gettypeid')
    let _TYPE           = TYPE_FROM_SYS.data[0].typeID
    if ((PERM.includes(TYPE) && TYPE === _TYPE) && TOKEN) {
        genContent()
    } else {
        notFound()
    }
}


async function genContent() {
    let users
    let apprUsers       = await sqlQueriesGET('listsapprusers')
    let apprLeaves      = await sqlQueriesGET('historyapprove')
    console.log(apprUsers, apprLeaves)
    if (apprUsers.data) {
        users           = apprUsers.data.rawdata
    }
    let leaves          = apprLeaves.data
    let cards
    if (users) {
        LISTS           = await sortedLists(users, leaves)
        cards           = await templateHistoryApprove(LISTS)
    } else {
        cards           = '- Empty -'
    }
    let sidebar         = await templateSidebar()
    let header          = await templateHeader()
    let modal           = await templateModal()
    let markup          = sidebar + header + modal + cards
    document.getElementById('container').innerHTML = markup
}


function sortedLists(users, leaves) {
    let data                = []
    return new Promise(function (resolve, reject) {
        for (const leave of leaves) {
            for (const user of users) {
                if (user.UID == leave.UID) {
                    data.push({
                        leaveID     : leave.leaveID,
                        leaveType   : leave.leaveType,
                        timeStamp   : leave.timeStamp,
                        dateStart   : leave.dateStart,
                        dateEnd     : leave.dateEnd,
                        reasons     : leave.reasons,
                        status      : leave.status,
                        URL         : leave.URL,
                        nickname    : user.nickname,
                        empID       : user.empID
                    })
                }
            }
        }
        resolve(data)
    })
}


async function onModalDetail(id) {
    console.log(id)
    let content     = LISTS.find((item) => {return id == item.leaveID})
    let edit        = await templateMoreDetail(content)
    toggleModal()
    document.getElementById('modal-container').innerHTML = edit
}


function toggleModal() {
    let body                        = document.body
    let modal                       = document.getElementById('modal-container')
    if (modal.style.display == 'block') {
        modal.style.display         = 'none'
        body.style.overflowY        = 'scroll'
    } else {
        modal.style.display         = 'block'
        body.style.overflow         = 'hidden'
    }
}


window.onclick = function (event) {
    let modal                   = document.getElementById('modal-container')
    let side                    = document.getElementById('side-container')
    let body                    = document.body
    if (event.target == modal) {
        body.style.overflowY    = 'scroll'
        modal.style.display     = 'none'
        VALUES                  = {}
    }
    if (event.target == side) {
        side.style.display      = 'none'
    }
}