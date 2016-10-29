# install.packages("rjson")
# install.packages("RJSONIO")
library(RJSONIO)
library(rjson)
fileUrl <- "http://webservices.ingv.it/fdsnws/event/1/query?starttime=2016-10-22T00%3A00%3A00&endtime=2016-10-29T23%3A59%3A59&minmag=2&maxmag=10&mindepth=0&maxdepth=1000&minlat=-90&maxlat=90&minlon=-180&maxlon=180&minversion=100&orderby=time-asc&format=text&limit=4000"
download.file(fileUrl,destfile="dataset.txt")
DF_RealTime_earthquake_INGV_raw <- read.table(fileUrl, sep="|", header=FALSE)
DF_RealTime_earthquake_INGV <- DF_RealTime_earthquake_INGV_raw[,c(2:5,11,13)]
colnames(DF_RealTime_earthquake_INGV)<- c("dataOraUTC","lat","long","profonditaKm","magnitudo","provinciaZona")
#View(DF_RealTime_earthquake_INGV)
JSON_RealTime_earthquake <- toJSON(unname(split(DF_RealTime_earthquake_INGV, 1:nrow(DF_RealTime_earthquake_INGV))))
cat(JSON_RealTime_earthquake)
write(JSON_RealTime_earthquake, "JSON_RealTime_earthquake.json")