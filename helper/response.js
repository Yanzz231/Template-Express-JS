const responseJson = (res, status, data, message) => {
    return res.json({
        status: status,
        data: data,
        message: message
    })
}

module.exports = {
    responseJson
}