/**
 * @authors Your Name (you@example.org)
 * @date    2019-08-16 21:35:59
 * @version $Id$
 */
import axios from '../lib/ajaxResquest'

// 全部是promise
export const getTest = () => axios.request({url: '/test'})

export const getLogin = (username) => axios.request({
  url: '/login',
  method: 'POST',
  data: { username }
})

export const getValidate = () => axios.request({url: '/validate'})

export const getExample = () => axios.request({
  url: '/org/queryOrgByOrgCode/621122008'
})
