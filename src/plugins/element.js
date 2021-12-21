import {
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
  ElUpload,
  ElProgress
} from 'element-plus'
import 'element-plus/dist/index.css'

export default app => {
  app.use(ElButton)
  app.use(ElForm)
  app.use(ElFormItem)
  app.use(ElInput)
  app.use(ElUpload)
  app.use(ElProgress)
}
