using System;
using System.Collections.Generic;
using System.Linq;
using Lidarr.Api.V1.Albums;
using Lidarr.Api.V1.Artist;
using Lidarr.Api.V1.Tracks;
using Lidarr.Http;
using Lidarr.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using NzbDrone.Core.CustomFormats;
using NzbDrone.Core.Datastore;
using NzbDrone.Core.DecisionEngine.Specifications;
using NzbDrone.Core.Download;
using NzbDrone.Core.History;
using NzbDrone.Core.Music;

namespace Lidarr.Api.V1.History
{
    [V1ApiController]
    public class HistoryController : Controller
    {
        private readonly IHistoryService _historyService;
        private readonly ICustomFormatCalculationService _formatCalculator;
        private readonly IUpgradableSpecification _upgradableSpecification;
        private readonly IFailedDownloadService _failedDownloadService;
        private readonly IArtistService _artistService;

        public HistoryController(IHistoryService historyService,
                             ICustomFormatCalculationService formatCalculator,
                             IUpgradableSpecification upgradableSpecification,
                             IFailedDownloadService failedDownloadService,
                             IArtistService artistService)
        {
            _historyService = historyService;
            _formatCalculator = formatCalculator;
            _upgradableSpecification = upgradableSpecification;
            _failedDownloadService = failedDownloadService;
            _artistService = artistService;
        }

        protected HistoryResource MapToResource(EntityHistory model, bool includeArtist, bool includeAlbum, bool includeTrack)
        {
            var resource = model.ToResource(_formatCalculator);

            if (includeArtist)
            {
                resource.Artist = model.Artist.ToResource();
            }

            if (includeAlbum)
            {
                resource.Album = model.Album.ToResource();
            }

            if (includeTrack)
            {
                resource.Track = model.Track.ToResource();
            }

            if (model.Artist != null)
            {
                resource.QualityCutoffNotMet = _upgradableSpecification.QualityCutoffNotMet(model.Artist.QualityProfile.Value, model.Quality);
            }

            return resource;
        }

        [HttpGet]
        public PagingResource<HistoryResource> GetHistory(bool includeArtist = false, bool includeAlbum = false, bool includeTrack = false)
        {
            var pagingResource = Request.ReadPagingResourceFromRequest<HistoryResource>();
            var pagingSpec = pagingResource.MapToPagingSpec<HistoryResource, EntityHistory>("date", SortDirection.Descending);

            var eventTypeFilter = pagingResource.Filters.FirstOrDefault(f => f.Key == "eventType");
            var albumIdFilter = pagingResource.Filters.FirstOrDefault(f => f.Key == "albumId");
            var downloadIdFilter = pagingResource.Filters.FirstOrDefault(f => f.Key == "downloadId");

            if (eventTypeFilter != null)
            {
                var filterValue = (EntityHistoryEventType)Convert.ToInt32(eventTypeFilter.Value);
                pagingSpec.FilterExpressions.Add(v => v.EventType == filterValue);
            }

            if (albumIdFilter != null)
            {
                var albumId = Convert.ToInt32(albumIdFilter.Value);
                pagingSpec.FilterExpressions.Add(h => h.AlbumId == albumId);
            }

            if (downloadIdFilter != null)
            {
                var downloadId = downloadIdFilter.Value;
                pagingSpec.FilterExpressions.Add(h => h.DownloadId == downloadId);
            }

            return pagingSpec.ApplyToPage(_historyService.Paged, h => MapToResource(h, includeArtist, includeAlbum, includeTrack));
        }

        [HttpGet("since")]
        public List<HistoryResource> GetHistorySince(DateTime date, EntityHistoryEventType? eventType = null, bool includeArtist = false, bool includeAlbum = false, bool includeTrack = false)
        {
            return _historyService.Since(date, eventType).Select(h => MapToResource(h, includeArtist, includeAlbum, includeTrack)).ToList();
        }

        [HttpGet("artist")]
        public List<HistoryResource> GetArtistHistory(int artistId, int? albumId = null, EntityHistoryEventType? eventType = null, bool includeArtist = false, bool includeAlbum = false, bool includeTrack = false)
        {
            var artist = _artistService.GetArtist(artistId);

            if (albumId.HasValue)
            {
                return _historyService.GetByAlbum(albumId.Value, eventType).Select(h =>
                {
                    h.Artist = artist;

                    return MapToResource(h, includeArtist, includeAlbum, includeTrack);
                }).ToList();
            }

            return _historyService.GetByArtist(artistId, eventType).Select(h =>
            {
                h.Artist = artist;

                return MapToResource(h, includeArtist, includeAlbum, includeTrack);
            }).ToList();
        }

        [HttpPost("failed/{id}")]
        public object MarkAsFailed([FromRoute] int id)
        {
            _failedDownloadService.MarkAsFailed(id);
            return new { };
        }
    }
}
