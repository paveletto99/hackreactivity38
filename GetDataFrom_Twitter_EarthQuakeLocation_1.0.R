##install.packages(twitteR)
##install.packages(ROAuth)
library(twitteR)
library(ROAuth)
library(RJSONIO)
library(rjson)
### setting up TWITTER Authorize for App "hackreactivity38"
consumer_key="0DxyVjB7TYWxavVS7FyyHlXBA"
consumer_secret="raau8eEwXheBWP7LFRETNNJPKryEYi6CxtPyk0Eh90W6NYEMcD"
access_token="713741192735940608-tXtMEg9Z5lFwVL9uOj2RmAlfkB7gFTj"
access_token_secret="cKAveHye69SJOtceQu7Er3BiehOa0XPM50zWyQpmUGuc1"
requestURL <- "https://api.twitter.com/oauth/request_token"
accessURL <- "http://api.twitter.com/oauth/access_token"
authURL <- "http://api.twitter.com/oauth/authorize"
setup_twitter_oauth(consumer_key, consumer_secret, access_token=access_token, access_secret=access_token_secret)
### End of Twitter Authorize
###
### define GeoCode search for sample event
### {"dataOraUTC":"2016-10-22T05:24:56.260000","lat":42.7707,"long":13.1322,"profonditaKm":6,"magnitudo":2.9}
###
#Lat<- 42.7707
#Long<- 13.1322
GeoCode="42.7707,13.1322,500km"
GeoCode
tweets <-searchTwitter("TERREMOTO OR #TERREMOTO OR terremoto OR #terremoto", geocode="42.7707,13.1322,25km",  n=1000, retryOnRateLimit=1)
DF_Twitter_hastagSearch_RAW <- twListToDF(tweets)
##View(DF_Twitter_hastagSearch_RAW)
### Output to JSON
JSON_Twitter_hastagSearch_RAW <- toJSON(unname(split(DF_Twitter_hastagSearch_RAW, 1:nrow(DF_Twitter_hastagSearch_RAW))))
##cat(JSON_Twitter_hastagSearch_RAW)
write(JSON_Twitter_hastagSearch_RAW, "JSON_Twitter_hastagSearch_RAW.json")
