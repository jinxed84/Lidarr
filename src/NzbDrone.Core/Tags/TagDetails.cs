using System.Collections.Generic;
using System.Linq;
using NzbDrone.Core.Datastore;

namespace NzbDrone.Core.Tags
{
    public class TagDetails : ModelBase
    {
        public string Label { get; set; }
        public List<int> ArtistIds { get; set; }
        public List<int> NotificationIds { get; set; }
        public List<int> RestrictionIds { get; set; }
        public List<int> DelayProfileIds { get; set; }
        public List<int> ImportListIds { get; set; }
        public List<int> RootFolderIds { get; set; }
        public List<int> IndexerIds { get; set; }
        public List<int> DownloadClientIds { get; set; }

        public bool InUse => ArtistIds.Any() ||
                             NotificationIds.Any() ||
                             RestrictionIds.Any() ||
                             DelayProfileIds.Any() ||
                             ImportListIds.Any() ||
                             RootFolderIds.Any() ||
                             IndexerIds.Any() ||
                             DownloadClientIds.Any();
    }
}
