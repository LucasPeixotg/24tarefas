function sortTasksByDoneAndDate(a, b) {
    if(a.done && !b.done)      return 1
    else if(!a.done && b.done) return -1
    
    const dateA = new Date(a.dueDate)
    const dateB = new Date(b.dueDate)
    if(dateA < dateB) return -1
    if(dateA > dateB) return 1
    
    return 0
}

module.exports = { sortTasksByDoneAndDate }