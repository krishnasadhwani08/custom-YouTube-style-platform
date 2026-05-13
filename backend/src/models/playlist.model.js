import mongoose,{Schame} from " mongoose";

const playlistSchema = new Schama(
    {
        name:{
            type : String,
            required : true,
        },
        videos:{
            type : Schema.Types.Objectid,
            ref:"Video",
            required:true,
        },
        owner:{
            type : Schema.Types.Objectid,
            ref:"User"

        },
        descriptions:{
            type : String,
            required :true
        }
    }
,{timestamps:true})

export const Playlist =mongoose.model("Playlist",playlistSchema)