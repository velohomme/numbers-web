package com.summithill.numbers;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class SoundFileNameRetriever extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static final String SOUNDS_DIRECTORY = "/eclipse-workspaces/numbers/numbers/WebContent/sounds";
	private static final long RECENT_MINUTES = 120;

    public SoundFileNameRetriever() {
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String folder = request.getParameter("folder");
		response.setContentType("application/json");
		response.getWriter().write(getResponse(folder));
	}
	
	
	private List<String> getSoundFileNames(String folderName) {
		File soundFolder = getSoundFolder(folderName);
		List<String> fileNames = new ArrayList<String>();
		for (File file : soundFolder.listFiles()) {
			if (isSoundFile(file)) {
				String name = getSoundName(file);
				fileNames.add(name);
			}
		}
		return fileNames;
	}

	// answers a list of the most recently updated sound names...most recent first
	private List<String> getRecentSoundFileNames(String folderName) {
		long recentMs = RECENT_MINUTES * 60000;
		File soundFolder = getSoundFolder(folderName);
		List<File> recentFiles = new ArrayList<File>();
		for (File file : soundFolder.listFiles()) {
			if (isSoundFile(file)) {
				if (file.lastModified() > System.currentTimeMillis() - recentMs) {
					recentFiles.add(file);
				}
			}
		}
		Collections.sort(recentFiles, new Comparator<File>() {
			public int compare(File o1, File o2) {
				return new Long(o1.lastModified()).compareTo(new Long(o2.lastModified()));
			}
		});
		List<String> soundNames = new ArrayList<String>();
		for (File file : recentFiles) {
			soundNames.add(getSoundName(file));
		}
		return soundNames;
	}

	private String getResponse(String folderName) {
		StringBuilder sb = new StringBuilder();
		sb.append("{\"soundNames\":");
		sb.append(getJsonStringForList(getSoundFileNames(folderName)));
		sb.append("\n,\"recentNames\":");
		sb.append(getJsonStringForList(getRecentSoundFileNames(folderName)));
		sb.append("}");
		return sb.toString();
	}
	
	private String getJsonStringForList(List<String> values) {
		StringBuilder sb = new StringBuilder();
		sb.append('[');
		boolean first = true;
		for (String value : values) {
			if (first == false) {
				sb.append(",");	
			}
			first = false;
			sb.append("\"");
			sb.append(value);
			sb.append("\"");
		}
		sb.append(']');
		return sb.toString();
	}
	
	
	private File getSoundFolder(String folderName) {
		File soundFolder = new File(SOUNDS_DIRECTORY + File.separator + folderName);
		if (! soundFolder.exists()) {
			throw new RuntimeException("Folder " + soundFolder + " does not exist");
		}
		return soundFolder;
	}

	private String getSoundName(File file) {
		String name = file.getName().substring(0, file.getName().length() - 4);
		return name;
	}

	private boolean isSoundFile(File file) {
		return file.isFile() && file.getName().toLowerCase().endsWith(".mp3");
	}

}
