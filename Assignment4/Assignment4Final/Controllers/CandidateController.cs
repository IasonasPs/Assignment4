﻿using Assignment4Final.Services;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing.Matching;
using ModelLibrary.Models.DTO;
using ModelLibrary.Models.DTO.Candidates;
using ModelLibrary.Models.DTO.Certificates;
using ModelLibrary.Models.DTO.Questions;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Assignment4Final.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CandidateController : ControllerBase
    {
        private readonly CandidateService _candidateService;

        public CandidateController(CandidateService candidateService)
        {            
            _candidateService = candidateService;
        }

        // GET: api/<CandidateController>
        [HttpGet]
        public async Task<IActionResult> GetAllCandidates()
        {
            return Ok(await _candidateService.GetAll());
        }

        // GET api/<CandidateController>/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCandidateById(string id)
        {
            var candidate = await _candidateService.GetCandidateById(id);
            if (candidate == null)
            {
                return NotFound(
                    new BaseResponse<CandidatesDto>
                    {
                        Success = false,
                        Message = $"Candidate: {id} not found."
                    }
                );
            }

            var response = new BaseResponse<CandidatesDto>
            {
                Success = true,
                Data = candidate
            };

            return Ok(response);
        }

        // POST api/<CandidateController>
        [HttpPost]
        public async Task<IActionResult> CreateCandidate([FromBody] CandidatesDto candidatesDto)
        {
            var addedCandidate = await _candidateService.AddCandidate(candidatesDto);
            if (addedCandidate == null)
            {
                return BadRequest(
                    new BaseResponse<CandidatesDto>
                    {
                        Success = false,
                        Message = "Failed to add candidate."
                    }
                );
            }

            var response = new BaseResponse<CandidatesDto>
            {
                Success = true,
                Data = addedCandidate
            };

            return CreatedAtAction(nameof(GetCandidateById), new { id = addedCandidate.AppUserId }, response);
        }

        // PUT api/<CandidateController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCandidate(string id, [FromBody] CandidatesDto candidatesDto)
        {
            var addedCandidate = await _candidateService.UpdateCandidate(id, candidatesDto);
            if (addedCandidate == null)
            {
                return BadRequest(
                    new BaseResponse<CandidatesDto>
                    {
                        Success = false,
                        Message = "Failed to add candidate."
                    }
                );
            }

            var response = new BaseResponse<CandidatesDto>
            {
                Success = true,
                Data = addedCandidate
            };

            return Ok(response);
        }

        // DELETE api/<CandidateController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCandidate(string id)
        {
            var response = new BaseResponse<CandidatesDto>
            {
                RequestId = Guid.NewGuid().ToString()
            };

            var candidateDeleted = await _candidateService.DeleteCandidate(id);

            if (candidateDeleted == null)
            {
                response.Success = false;
                response.Message = $"Error in deleting Question with id: {id}";
                return NotFound(response);
            }

            response.Success = true;
            response.Data = candidateDeleted;

            return Ok(response);
            
        }
    }
}