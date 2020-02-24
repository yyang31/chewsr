function getGroupByID(req, res) {
    const groupId = req.params.group_id;

    return res.json({
        success: true,
        data: groupId
    });
}

module.exports = {
    getGroupByID
}