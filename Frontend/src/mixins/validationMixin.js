
export default {
	methods: {

    validateType(item, type) {
      if (item && type == "string" && typeof(item) !== "string") return false
      else if (item && type == "number" && typeof(item) !== "number") return false
      else if (type == "boolean" && typeof(item) !== "boolean") return false
      else if (item && type == "object" && typeof(item) !== "object") return false
      else if (item && type == "array" && !Array.isArray(item)) return false

      return true
    },

    validateObject(body, requirements) {
      if (!body) return "Invalid data! Please fill all required fields!"

      for  (const item of requirements) {
        const key = item.name
        if (item.type !== "boolean" && !body[key]) return `Invalid data: "${key}" is required`
        if (item.type == "number" && !this.validateType(body[key], item.type)) body[key] = +body[key]
        if (item.type == "array" && !this.validateType(body[key], item.type)) body[key] = JSON.parse(body[key])
        if (item.type == "object" && !this.validateType(body[key], item.type)) body[key] = JSON.parse(body[key])

        if (!this.validateType(body[key], item.type)) return `Invalid data: "${key}" must be ${item.type}`
      }

      return false
    },

    createFormData(data) {
      const formData = new FormData()
      for (const [key, value] of Object.entries(data)) {
        if (value != null && value != undefined) {
          const val = typeof(value) == "object" ? JSON.stringify(value) : value
          formData.append(key, val)
        }
      }
      return formData
    }
	}
}