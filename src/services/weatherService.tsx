import { CancelTokenSource } from "axios"
import baseService from "./baseService"

const getLocalWeather = async (courseId: string, source: CancelTokenSource): Promise<LocalWeather> => {
  const response = await baseService.get(`/courses/${courseId}/weather`, source)
  return {
    description: response.data.description,
    temperature: response.data.temperature,
    windSpeed: response.data.wind_speed,
    rain: response.data.rain,
    snow: response.data.snow,
    sunsetTime: response.data.sunset_time,
    iconURL: response.data.icon_url,
  }
}

export default {
  getLocalWeather,
}
