package com.hypercube.tvdb.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hypercube.tvdb.api.model.TvShow;

@Repository
public interface TvDbRepository extends JpaRepository<TvShow, Long>{	
}
