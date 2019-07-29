export function deleteProject (_id, url, params) {
  console.log('id', _id)
  this.$confirm('删除此项目, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      projectAPI.deleteProject(_id).then((data) => {
        console.log('_id:', _id)
        console.log('data:', data)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        url(params)
      })
        .catch((error) => {
          console.log('error', error)
          this.$message.error('删除失败！')
        })
    })
}

export default {
  deleteProject
}